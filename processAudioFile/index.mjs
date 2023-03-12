import middy from "middy";
import { verifyTokenMiddleware } from "./functionality/auth/verifyTokenMiddleware";
import { transcribeAudioFile } from "./functionality/main/transcribeAudioFile";
import { uploadAudioFileToBucket } from "./functionality/main/uploadAudioFileToBucket";


const bucketName = process.env.BUCKET_NAME;
const jwtSecret = process.env.JWT_SECRET;

/**
The main handler function.
* @param {Object} event - The event object.
* @param {Object} event.user - The user object from the JWT token.
* @param {string} event.body - The request body as a JSON string.
* @returns {Object} An object containing the status
**/
const myHandler = async (event) => {
  const user = event.user;
  const body = event.body;
  const bodyObj = JSON.parse(body);
  const fileEncoded = JSON.stringify(bodyObj.event);
  const fileDecoded = Buffer.from(fileEncoded, "base64");

  uploadAudioFileToBucket(bucketName, fileDecoded, "test.wav")
    .then(() =>
      transcribeAudioFile("gs://nebulaii-audio-files/test.wav", "en-US")
    )
    .catch((e) => {
      console.log(e);
    });
};

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
