import speech from "@google-cloud/speech";
import jwt from "jsonwebtoken";
import middy from "middy";

const bucketName = process.env.BUCKET_NAME;
const client = new speech.SpeechClient();

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

const transcribeAudioFile = async (bucketPath, languageCode) => {
  // The path to the remote LINEAR16 file
  const gcsUri = bucketPath;

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: languageCode,
    enableSpeakerDiarization: true,
    minSpeakerCount: 2,
    maxSpeakerCount: 15,
    model: "phone_call",
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
  console.log("Speaker Diarization:");
  const result = response.results[response.results.length - 1];
  const wordsInfo = result.alternatives[0].words;
  // Note: The transcript within each result is separate and sequential per result.
  // However, the words list within an alternative includes all the words
  // from all the results thus far. Thus, to get all the words with speaker
  // tags, you only have to take the words list from the last result:
  wordsInfo.forEach((a) =>
    console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
  );
};

/**
The main handler function.
@param {Object} event - The event object.
@param {Object} event.user - The user object from the JWT token.
@param {string} event.body - The request body as a JSON string.
@returns {Object} An object containing the status
**/
const myHandler = async (event) => {
  // const user = event.user;
  // const body = event.body;
  // const bodyObj = JSON.parse(body);
  // const fileEncoded = JSON.stringify(bodyObj.event);
  // const fileDecoded = Buffer.from(fileEncoded, 'base64');
  // const jsonBlob = new Blob([fileDecoded], { type: 'application/json' });
  // const file0 = new File([jsonBlob], 'test_file_5.json', { type: 'application/json' });
  const res = await transcribeAudioFile(
    "gs://nebulaii-audio-files/test.m4a",
    "en-US"
  );
  return res;
};

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
