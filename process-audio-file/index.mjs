import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createSuccessResponse } from "./utils/createSuccessResponse.mjs";
import { createErrorResponse } from "./utils/createErrorResponse.mjs";
import { mainHandler } from "./handlers/mainHandler.mjs";

const jwtSecret = process.env.JWT_SECRET;

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

    if (!userEmail || !filename || !dateAdded) {
      throw new Error("Data validation failed.");
    }

    const { transcript, notes } = await mainHandler(
      userEmail,
      filename,
      language,
      enableSpeakerDiarization,
      speakerCount,
      description,
      dateAdded
    );

    return createSuccessResponse(transcript, notes);
  } catch (error) {
    console.log(error);
    return createErrorResponse();
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
