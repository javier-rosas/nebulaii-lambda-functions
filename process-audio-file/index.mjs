import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createResponse } from "./utils/createResponse.mjs";
import { processAudioFile } from "./handlers/processAudioFile.mjs";
import { processYoutubeFile } from "./handlers/processYoutubeFile.mjs";


const jwtSecret = process.env.JWT_SECRET;
const ALLOWED_FILE_TYPES = ['audio/mp3', 'audio/mp4', 'audio/wav', 'audio/m4a']

/**
 * Handle an AWS Lambda event.
 * @param {Object} event - The event object passed by AWS Lambda.
 * @param {Object} context - The context object passed by AWS Lambda.
 * @returns {Promise<Object>} - A Promise that resolves with an HTTP response object.
 */
const myHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await mongooseConnect();
    const userEmail = event.user.email;
    const {
      filename,
      language,
      enableSpeakerDiarization,
      minSpeakerCount,
      dateAdded,
      description,
      fileType,
    } = JSON.parse(event.body);

    if (!userEmail || !filename || !dateAdded) {
      throw new Error("Data validation failed.");
    }

    const fileData = {
      userEmail,
      filename,
      language,
      enableSpeakerDiarization,
      minSpeakerCount,
      description,
      dateAdded,
      fileType,
    };

    switch (event.routeKey) {
      case "POST /api/v1/audio-files/process-audio-file":
        return await processAudioFile(fileData);
        // TODO: delete old audio file from gcp bucket, if file is converted to wav
      case "POST /api/v1/youtube/process-audio-file":
        return await processYoutubeFile(fileData);
        // TODO: delete audio from gcp bucket 
      default:
        return createResponse(404, { error: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    return createResponse(500, { error: error.message });
  }
};

/**
 * A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 * @type {function}
 * @param {function} myHandler - The AWS Lambda handler function to be wrapped with middleware.
 * @returns {function} - A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 */
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
