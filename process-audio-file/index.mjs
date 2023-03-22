import middy from "middy";
import { verifyTokenMiddleware } from "./functionality/auth/verifyTokenMiddleware.mjs";
import { transcribeAudioFile } from "./functionality/main/transcribeAudioFile.mjs";
import { mongooseConnect } from "./functionality/mongoose/mongooseConnect.mjs";
import { createNotes } from "./functionality/main/createNotes.mjs";
import TranscriptDao from "./functionality/daos/TranscriptDao.mjs";
import DiarizedTranscriptDao from "./functionality/daos/DiarizedTranscriptDao.mjs";
import NotesDao from "./functionality/daos/NotesDao.mjs";

const bucketName = process.env.BUCKET_NAME;
const jwtSecret = process.env.JWT_SECRET;

/**
 * Create a transcript object from an audio file object and a user object.
 *
 * @async
 * @function
 * @param {Object} audioFileObj - An object containing information about an audio file.
 * @param {string} audioFileObj.filename - The name of the audio file.
 * @param {string} audioFileObj.language - The language of the audio file.
 * @param {boolean} audioFileObj.enableSpeakerDiarization - Whether to enable speaker diarization.
 * @param {number} audioFileObj.minSpeakerCount - The minimum number of speakers to diarize.
 * @param {number} audioFileObj.maxSpeakerCount - The maximum number of speakers to diarize.
 * @param {string} audioFileObj.dateAdded - The date the audio file was added.
 * @param {string} audioFileObj.description - A description of the audio file.
 * @param {Object} user - An object representing the user.
 * @param {string} user.email - The email address of the user.
 * @returns {Promise<Object>} - A Promise that resolves with the transcript object.
 */
const createTranscript = async (audioFileObj, user) => {
  const {
    filename,
    language,
    enableSpeakerDiarization,
    minSpeakerCount,
    maxSpeakerCount,
    dateAdded,
    description,
  } = audioFileObj;

  const languageCode = language === "Spanish" ? "es-ES" : "en-US";
  const bucketPath = `gs://${bucketName}/${user.email}/${filename}`;
  await mongooseConnect();
  const transcript = await transcribeAudioFile(
    bucketPath,
    languageCode,
    enableSpeakerDiarization,
    minSpeakerCount,
    maxSpeakerCount
  );

  return {
    userEmail: user.email,
    filename,
    description,
    dateAdded,
    transcript,
  };
};

/**
 * Save a transcript object to the appropriate DAO.
 *
 * @async
 * @function
 * @param {Object} transcriptObj - An object containing information about a transcript.
 * @param {string} transcriptObj.userEmail - The email address of the user who created the transcript.
 * @param {string} transcriptObj.filename - The name of the audio file that was transcribed.
 * @param {string} transcriptObj.description - A description of the audio file.
 * @param {string} transcriptObj.dateAdded - The date the audio file was added.
 * @param {string} transcriptObj.transcript - The text of the transcript.
 * @param {boolean} enableSpeakerDiarization - Whether to enable speaker diarization.
 * @returns {Promise<Object>} - A Promise that resolves with the MongoDB model of the saved transcript.
 */
const saveTranscript = async (transcriptObj, enableSpeakerDiarization) => {

  if (enableSpeakerDiarization) {
    const diarizedTranscriptDao = new DiarizedTranscriptDao();
    return await diarizedTranscriptDao.createOrUpdateDiarizedTranscript(
      transcriptObj
    );
  } else {
    const transcriptDao = new TranscriptDao();
    return await transcriptDao.createOrUpdateTranscript(transcriptObj);
  }
};

/**
 * Extracts audio file object from event body.
 *
 * @param {object} event - The event object.
 * @returns {object} The parsed audio file object.
 */
const extractAudioFileObject = (event) => {
  return JSON.parse(event.body);
};

/**
 * Creates and saves notes object in database.
 *
 * @async
 * @param {object} transcriptObj - The transcript object.
 * @returns {Promise<object>} The notes object created in the database.
 */
const createAndSaveNotes = async (transcriptObj, userEmail) => {
  const transcriptDescription =
  audioFileObj.enableSpeakerDiarization === true
    ? `Number of speakers: ${audioFileObj.minSpeakerCount}`
    : "Number of speakers: 1";
  transcriptObj.description = transcriptDescription;
  const notes = await createNotes(transcriptObj);
  const notesDao = new NotesDao();
  const notesObj = {
    userEmail,
    filename: transcriptObj.filename,
    description: transcriptObj.description,
    dateAdded: transcriptObj.dateAdded,
    notes: notes,
  };
  return await notesDao.createOrUpdateNotes(notesObj);
};

/**
 * Creates a success response object.
 *
 * @param {object} mongoTranscriptModel - The transcript object returned from MongoDB.
 * @param {object} notesMongooseModel - The notes object returned from Mongoose.
 * @returns {object} The success response object.
 */
const createSuccessResponse = (mongoTranscriptModel, notesMongooseModel) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      status: 200,
      message: "Successful processing.",
      transcript: mongoTranscriptModel,
      notes: notesMongooseModel,
    }),
  };
};

/**
 * Creates an error response object.
 *
 * @returns {object} The error response object.
 */
const createErrorResponse = () => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      ok: false,
      status: 500,
      error: "Internal server error",
    }),
  };
};

/**
 * Handle an AWS Lambda event.
 *
 * @async
 * @function
 * @param {Object} event - The event object passed by AWS Lambda.
 * @param {Object} context - The context object passed by AWS Lambda.
 * @returns {Promise<Object>} - A Promise that resolves with an HTTP response object.
 */
const myHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const audioFileObj = extractAudioFileObject(event);
    const transcriptObj = await createTranscript(audioFileObj, event.user);
    const mongoTranscriptModel = await saveTranscript(
      transcriptObj,
      audioFileObj.enableSpeakerDiarization
    );
    const notesObj = await createAndSaveNotes(transcriptObj, event.user.email);
    return createSuccessResponse(mongoTranscriptModel, notesObj);
  } catch (error) {
    console.log("error", error);
    return createErrorResponse();
  }
};

/**
 * A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 *
 * @constant
 * @type {function}
 * @param {function} myHandler - The AWS Lambda handler function to be wrapped with middleware.
 * @returns {function} - A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 */
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
