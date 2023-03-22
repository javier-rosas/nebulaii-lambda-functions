import { v1p1beta1 as speech } from "@google-cloud/speech";
import { convertWordArrToSentenceArr } from "../utils/convertWordArrToSentenceArr.mjs";
const client = new speech.SpeechClient();

/**
 * Transcribes an audio file located in a Google Cloud Storage bucket
 * using the Google Cloud Speech-to-Text API with speaker diarization.
 * @async
 * @function
 * @param {string} bucketPath - The path to the audio file in the Google Cloud Storage bucket.
 * @param {string} languageCode - The language code of the audio file.
 * @returns {Array} - An array of sentences with speaker tags.
 */
export async function transcribeAudioFile(
  bucketPath, 
  languageCode,
  enableSpeakerDiarization,
  speakerCount
  ) {
  const gcsUri = bucketPath;

  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 48000,
    languageCode,
    enableSpeakerDiarization,
    enableAutomaticPunctuation: true,
    minSpeakerCount: speakerCount,
    maxSpeakerCount: speakerCount,
    model: "latest_long",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  let transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  console.log("here 3")

  if (enableSpeakerDiarization) {
    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;
    transcription = convertWordArrToSentenceArr(wordsInfo);
  }

  console.log("here 4")

  return transcription
}
