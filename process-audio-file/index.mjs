import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createResponse } from "./utils/createResponse.mjs";
import { mainHandler } from "./handlers/mainHandler.mjs";
import { processAudioFile } from "./handlers/processAudioFile.mjs";
import { processYoutubeFile } from "./handlers/processYoutubeFile.mjs";

const jwtSecret = process.env.JWT_SECRET;
const ALLOWED_FILE_TYPES = ["audio/mp3", "audio/mp4", "audio/wav", "audio/m4a"];

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
    const audioFileObj = JSON.parse(event.body);
    const filename = audioFileObj.filename;
    const language = audioFileObj.language;
    const enableSpeakerDiarization = audioFileObj.enableSpeakerDiarization;
    const speakerCount = audioFileObj.minSpeakerCount;
    const dateAdded = audioFileObj.dateAdded;
    const description = audioFileObj.description;
    const fileType = audioFileObj.fileType;

    if (!audioFileObj.userEmail || !audioFileObj.filename || !audioFileObj.dateAdded) {
      throw new Error("Data validation failed.");
    }

    switch (event.routeKey) {
      case "POST /api/v1/audio-files/process-audio-file":
        return await processAudioFile(audioFileObj);
      case "POST /api/v1/youtube/process-audio-file":
        return await processYoutubeFile(audioFileObj);
      default:
        return createResponse(404, { error: "Not Found" });
    }

    // const { transcript, notes } = await mainHandler(
    //   userEmail,
    //   filename,
    //   language,
    //   enableSpeakerDiarization,
    //   speakerCount,
    //   description,
    //   dateAdded
    // );
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
