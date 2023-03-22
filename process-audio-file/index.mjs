import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createSuccessResponse } from "./utils/createSuccessResponse.mjs";
import { createErrorResponse } from "./utils/createErrorResponse.mjs";
import { createTranscriptHandler } from "./handlers/createTranscript.mjs";
import { createNotes } from "./handlers/createNotes.mjs";
import { saveNotes } from "./handlers/saveNotes.mjs";
import { saveTranscript } from "./handlers/saveTranscript.mjs";
import { saveFile } from "./handlers/saveFile.mjs";

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

    // connext to mongodb
    await mongooseConnect();

    // extract data from event
    const userEmail = event.user.email;
    const audioFileObj = JSON.parse(event.body);
    const filename = audioFileObj.filename;
    const language = audioFileObj.language;
    const enableSpeakerDiarization = audioFileObj.enableSpeakerDiarization;
    const speakerCount = audioFileObj.minSpeakerCount;
    const dateAdded = audioFileObj.dateAdded;
    const description = audioFileObj.description;

    // validate data
    if (!userEmail || !filename || !enableSpeakerDiarization || !dateAdded) {
      throw new Error('Missing required input');
    }

    // create transcript using google speech-to-text api
    const transcript = await createTranscriptHandler(
      filename,
      language,
      enableSpeakerDiarization,
      speakerCount,
      userEmail
    );

    // create transcript object to store in database
    const transcriptObj = {
      userEmail,
      filename,
      transcript,
    };

    // save transcript to database
    await saveTranscript(transcriptObj, enableSpeakerDiarization);

    // create notes using gpt-3.5 api
    const notes = await createNotes(transcript);

    // create notes object to store in database
    const notesObj = {
      userEmail,
      filename,
      notes,
    };

    // save notes to database
    await saveNotes(notesObj);

    // create file object to store in database
    const fileObj = {
      userEmail,
      filename,
      description,
      dateAdded,
    };

    // save file to database
    await saveFile(fileObj, enableSpeakerDiarization, speakerCount);

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
