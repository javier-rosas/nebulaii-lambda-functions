import { v1p1beta1 as speech } from "@google-cloud/speech";
import jwt from "jsonwebtoken";
import middy from "middy";

const bucketName = process.env.BUCKET_NAME;
const client = new speech.SpeechClient();
const jwtSecret = process.env.JWT_SECRET;

/**
* Verifies the JWT token provided in the HTTP headers of the incoming request.
* @param {Object} options - The options for the middleware.
* @param {string} options.secret - The JWT secret key.
* @returns {Object} The middleware object.
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


/**
* Converts array of word objects to array of sentence objects
* @param {Array} words array of word objects with speaker tags 
* @returns {Array} array of sentence objects in the form of:
 [
  { speakerTag: 1, "Hello, there!"},
  { speakerTag: 2, "Hey dude!"}
 ]
*/
function convert(words) {
  let sentences = [];
  let sentence = "";
  let currentSpeaker = words[0].speakerTag;

  words.forEach((word, index) => {
    if (word.speakerTag !== currentSpeaker || index === words.length - 1) {
      sentences.push({ speakerTag: currentSpeaker, sentence });
      sentence = "";
      currentSpeaker = word.speakerTag;
    }
    sentence += `${word.word} `;
  });

  let lastSentence = sentences[sentences.length - 1];
  if (lastSentence.sentence !== sentence && lastSentence.speakerTag !== currentSpeaker) {
    sentences.push({ speakerTag: currentSpeaker, sentence });
  } else if (lastSentence.sentence !== sentence && lastSentence.speakerTag === currentSpeaker) {
    lastSentence.sentence += sentence
  }

  return sentences;
}


/**
* Transcribes an audio file located in a Google Cloud Storage bucket
* using the Google Cloud Speech-to-Text API with speaker diarization.
* @async
* @function
* @param {string} bucketPath - The path to the audio file in the Google Cloud Storage bucket.
* @param {string} languageCode - The language code of the audio file.
* @returns {Array} - An array of sentences with speaker tags.
* @throws Will throw an error if the transcription fails.
*/
const transcribeAudioFile = async (bucketPath, languageCode) => {
  
  const gcsUri = bucketPath;

  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 48000,
    languageCode: languageCode,
    enableSpeakerDiarization: true,
    enableAutomaticPunctuation: true,
    minSpeakerCount: 2,
    maxSpeakerCount: 2,
    model: "latest_long",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = client.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  console.log(`Transcription: ${transcription}`);
  console.log("Speaker Diarization:");

  const result = response.results[response.results.length - 1];
  const wordsInfo = result.alternatives[0].words;
  const sentences = convert(wordsInfo)
  
  console.log(sentences);

  return sentences
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
    "gs://nebulaii-audio-files/test.wav",
    "en-US"
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Successful transcription.", 
      res
    })
  }
};

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);