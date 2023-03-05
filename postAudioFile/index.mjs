import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import middy from "middy";

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;
const jwtSecret = process.env.JWT_SECRET;

/**
Verifies the JWT token provided in the HTTP headers of the incoming request.
@param {Object} options - The options for the middleware.
@param {string} options.secret - The JWT secret key.
@returns {Object} The middleware object.
**/
const verifyTokenMiddleware = (options) => {
  return {
    before: (handler, next) => {
      const token = handler.event.headers.authorization;
      if (!token) {
        return next(new Error("Authorization token missing"));
      }
      try {
        const decoded = jwt.verify(token, options.secret);
        handler.event.user = decoded;
        next();
      } catch (err) {
        next(new Error("Invalid token"));
      }
    },
  };
};

/**
Uploads a file to an S3 bucket.
@param {string} bucketName - The name of the S3 bucket.
@param {string} file - The file to upload.
@param {string} fileName - The name of the file in the S3 bucket.
@returns {Object} An object containing the status code and URL of the uploaded file.
*/
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
      return {
        statusCode: 404,
        body: "Bucket does not exist",
      };
    } else if (error.code === "NoSuchKey") {
      return {
        statusCode: 404,
        body: "The file was not found",
      };
    } else {
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

/**
The main handler function.
@param {Object} event - The event object.
@param {Object} event.user - The user object from the JWT token.
@param {string} event.body - The request body as a JSON string.
@returns {Object} An object containing the status
**/
const myHandler = async (event) => {
  // user object
  const user = event.user;
  const body = event.body;
  const bodyObj = JSON.parse(body);
  const file = JSON.stringify(bodyObj.event);
  const res = await upload_to_aws(bucketName, file, "test_file_5.json");
  return res;
};

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
