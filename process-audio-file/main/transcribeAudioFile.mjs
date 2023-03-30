import { v1p1beta1 as speech } from "@google-cloud/speech";
import { convertWordArrToSentenceArr } from "../utils/convertWordArrToSentenceArr.mjs";
const client = new speech.SpeechClient();


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
