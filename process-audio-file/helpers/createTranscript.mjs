import { transcribeAudioFile } from "../main/transcribeAudioFile.mjs";

const bucketName = process.env.BUCKET_NAME;


export const createTranscript = async (fileData) => {
  const languageCode = fileData.language === "Spanish" ? "es-ES" : "en-US";
  const bucketPath = `gs://${bucketName}/${fileData.userEmail}/${fileData.filename}`;
  console.log("here 2")
  const transcript = await transcribeAudioFile(
    bucketPath,
    languageCode,
    fileData.enableSpeakerDiarization,
    fileData.speakerCount
  );

  return transcript
};
