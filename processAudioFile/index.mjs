import middy from "middy";
import { verifyTokenMiddleware } from "./functionality/auth/verifyTokenMiddleware.mjs";
import { transcribeAudioFile } from "./functionality/main/transcribeAudioFile.mjs";
import { mongooseConnect } from "./functionality/mongoose/mongooseConnect.mjs"
import TranscriptDao from "./functionality/daos/TranscriptDao.mjs"
import DiarizedTranscriptDao from "./functionality/daos/DiarizedTranscriptDao.mjs";

const bucketName = process.env.BUCKET_NAME;
const jwtSecret = process.env.JWT_SECRET;

/**
The main handler function.
* @param {Object} event - The event object.
* @param {Object} event.user - The user object from the JWT token.
* @param {string} event.body - The request body as a JSON string.
* @returns {Object} An object containing the status
**/
const myHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const user = event.user;
    const body = event.body;
    const audioFileObj = JSON.parse(body);  
    let languageCode = "en-US"
    if (audioFileObj.language === "Spanish") languageCode = "es-ES"
    const bucketPath = `gs://${bucketName}/${user.email}/${audioFileObj.filename}`
    await mongooseConnect()
    const transcript = await transcribeAudioFile(
      bucketPath, 
      languageCode,
      audioFileObj.enableSpeakerDiarization,
      audioFileObj.minSpeakerCount,
      audioFileObj.maxSpeakerCount
    )
    // const transcriptDao
    // PUT THESE TWO IN MONGO 
      // audioFileObj.description,
      // audioFileObj.dateAdded
      
    if (audioFileObj.enableSpeakerDiarization) {
      // call DiarizedTranscriptDao
      console.log("Calling Diarized Transcript Dao")
      const diarizedTranscriptDao = new DiarizedTranscriptDao()
    } else {
      console.log("Calling Transcript Dao")
      const transcriptDao = new TranscriptDao()
      const mongoTranscriptModel = await transcriptDao.create(transcript)
      
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, status: 200 })
    }
  } catch(error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Internal server error" }),
    };
  }
}

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
