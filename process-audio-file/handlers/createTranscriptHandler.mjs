import { transcribeAudioFile } from "../main/transcribeAudioFile.mjs";

const bucketName = process.env.BUCKET_NAME;

/**
 * Create a transcript object from an audio file object and a user object.
 * @param {string} filename - The name of the audio file.
 * @param {string} language - The language of the audio file.
 * @param {boolean} enableSpeakerDiarization - Whether to enable speaker diarization.
 * @param {number} minSpeakerCount - The minimum number of speakers to diarize.
 * @param {number} maxSpeakerCount - The maximum number of speakers to diarize.
 * @param {string} dateAdded - The date the audio file was added.
 * @param {string} description - A description of the audio file.
 * @param {string} userEmail - The email address of the user.
 * @returns {Promise<Object>} - A Promise that resolves with the transcript object.
 */
export const createTranscriptHandler = async (
  filename,
  language,
  enableSpeakerDiarization,
  speakerCount,
  userEmail
) => {
  const languageCode = language === "Spanish" ? "es-ES" : "en-US";
  const bucketPath = `gs://${bucketName}/${userEmail}/${filename}`;
  console.log("here 2")
  const transcript = await transcribeAudioFile(
    bucketPath,
    languageCode,
    enableSpeakerDiarization,
    speakerCount
  );

  return transcript
};
