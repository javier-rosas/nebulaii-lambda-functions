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
  minSpeakerCount,
  maxSpeakerCount
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
    minSpeakerCount,
    maxSpeakerCount,
    model: "latest_long",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  if (enableSpeakerDiarization) {
    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;
    const sentences = convertWordArrToSentenceArr(wordsInfo);
    return {
      blob: transcription,
      transcription: sentences
    };
  } else {
    return transcription
  }
}
