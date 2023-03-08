import { Storage } from "@google-cloud/storage";
import jwt from "jsonwebtoken";
import middy from "middy";

const storage = new Storage();
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
        console.log(err);
        next(new Error("Invalid token"));
      }
    },
  };
};

/**
 * Uploads an audio file to a Google Cloud Storage bucket.
 * @param {string} bucketName - The name of the bucket to upload the file to.
 * @param {string} audioFile - The local path of the audio file to upload.
 * @param {string} destinationFilename - The name of the file to create in the bucket.
 * @returns {Promise<{ statusCode: number, body: string }>} A Promise that resolves to a JSON object containing a status code and message.
 */
async function uploadAudioFileToBucket(
  bucketName,
  audioFile,
  destinationFilename
) {
  try {
    const file = storage.bucket(bucketName).file(destinationFilename);
    await file.save(audioFile);
    console.log(
      `Audio file ${audioFile} uploaded to bucket ${bucketName} as ${destinationFilename}.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Audio file uploaded successfully." }),
    };
  } catch (err) {
    console.error(`Error uploading audio file to bucket: ${err}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading audio file to bucket.",
      }),
    };
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
  const user = event.user;
  const body = event.body;
  const bodyObj = JSON.parse(body);
  const fileEncoded = JSON.stringify(bodyObj.event);
  const fileDecoded = Buffer.from(fileEncoded, "base64");
  const res = await uploadAudioFileToBucket(
    bucketName,
    fileDecoded,
    "test.mp3"
  );
  return res;
};

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
