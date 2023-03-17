import middy from "middy";
import { verifyTokenMiddleware } from "./functionality/auth/verifyTokenMiddleware.mjs";
import { transcribeAudioFile } from "./functionality/main/transcribeAudioFile.mjs";
import { mongooseConnect } from "./functionality/mongoose/mongooseConnect.mjs";
import TranscriptDao from "./functionality/daos/TranscriptDao.mjs";
import DiarizedTranscriptDao from "./functionality/daos/DiarizedTranscriptDao.mjs";

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
    console.log("Calling Diarized Transcript Dao");
    const diarizedTranscriptDao = new DiarizedTranscriptDao();
    return await diarizedTranscriptDao.create(transcriptObj);
  } else {
    console.log("Calling Transcript Dao");
    const transcriptDao = new TranscriptDao();
    return await transcriptDao.create(transcriptObj);
  }
};

/**
 * Handle an AWS Lambda event.
 *
 * @async
 * @function
 * @param {Object} event - The event object passed by AWS Lambda.
 * @param {Object} context - The context object passed by AWS Lambda.
 * @param {function} context.callbackWaitsForEmptyEventLoop - A function that sets whether the event loop should wait for pending events to complete.
 * @returns {Promise<Object>} - A Promise that resolves with an HTTP response object.
 */
const myHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const user = event.user;
    const body = event.body;
    const audioFileObj = JSON.parse(body);

    const transcriptObj = await createTranscript(audioFileObj, user);
    const mongoTranscriptModel = await saveTranscript(
      transcriptObj,
      audioFileObj.enableSpeakerDiarization
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        status: 200,
        message: "Succesful processing.",
        payload: mongoTranscriptModel,
      }),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        status: 501,
        error: "Internal server error",
      }),
    };
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
