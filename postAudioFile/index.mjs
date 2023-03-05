import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import middy from "middy";

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;
const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * TODO::::::::
 * 
 * 1) line 29
 * 
 * 
 *  
 */
const verifyTokenMiddleware = (options) => {
  return {
    before: (handler, next) => {
      const token = handler.event.headers.authorization;
      if (!token) {
        return next(new Error("Authorization token missing"));
      }
      try {
        console.log("token", token)
        console.log("options.secret", options.secret)
        const decoded = jwt.verify(token, options.secret);
        handler.event.user = decoded;
        next();
      } catch (err) {
        next(new Error("Invalid token"));
      }
    },
  };
};

async function upload_to_aws(bucketName, file, fileName) {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
    };
    await s3.putObject(params).promise();
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: bucketName,
      Key: fileName,
      Expires: 24 * 3600,
    });

    return {
      statusCode: 200,
      body: url,
    };
  } catch (error) {
    if (error.code === "NoSuchBucket") {
      console.log("Bucket does not exist");
      return {
        statusCode: 404,
        body: "Bucket does not exist",
      };
    } else if (error.code === "NoSuchKey") {
      console.log("The file was not found.");
      return {
        statusCode: 404,
        body: "The file was not found",
      };
    } else {
      console.log("An error occurred:", error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

const myHandler = async (event) => {
  const body = event.body;
  const bodyObj = JSON.parse(body);
  const file = JSON.stringify(bodyObj.event);
  const res = await upload_to_aws(bucketName, file, "test_file_5.json");
  return res;
};

export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);