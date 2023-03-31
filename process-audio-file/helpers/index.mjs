import { transcribeAudioFile } from "../main/transcribeAudioFile.mjs";
import DiarizedTranscriptDao from "../daos/DiarizedTranscriptDao.mjs";
import TranscriptDao from "../daos/TranscriptDao.mjs";
import { getGptNotes } from '../main/getGptNotes.mjs';
import NotesDao from "../daos/NotesDao.mjs";
import FileDao from "../daos/FileDao.mjs";

const bucketName = process.env.BUCKET_NAME;


export const createTranscript = async (fileData) => {
  console.log("filedata", fileData)
  const languageCode = fileData.language === "Spanish" ? "es-ES" : "en-US";
  const bucketPath = `gs://${bucketName}/${fileData.userEmail}/${fileData.filename}`;
  const transcript = await transcribeAudioFile(
    bucketPath,
    languageCode,
    fileData.enableSpeakerDiarization,
    fileData.minSpeakerCount
  );
  console.log("here 2 transcript", transcript)

  return transcript
};



export const saveTranscript = async (transcriptObj, enableSpeakerDiarization) => {
  console.log("here 5", enableSpeakerDiarization)
  if (enableSpeakerDiarization) {
    const diarizedTranscriptDao = new DiarizedTranscriptDao();
    return await diarizedTranscriptDao.createOrUpdateDiarizedTranscript(transcriptObj);
  } else {
    const transcriptDao = new TranscriptDao();
    return await transcriptDao.createOrUpdateTranscript(transcriptObj);
  }
};


export async function createNotes(transcript) {
  transcript = JSON.stringify(transcript);
  const prompt = `Summarize the following conversation in bullet points and provide action items if appropriate:\n\n${transcript}\n\nSummary:\n-`;
  const notes = await getGptNotes(prompt);
  return notes;
}


export const saveNotes = async (notesObj) => {
  const notesDao = new NotesDao();
  return await notesDao.createOrUpdateNotes(notesObj);
};


export const saveFile = async (fileObj, enableSpeakerDiarization, speakerCount) => {
  const transcriptDescription = enableSpeakerDiarization
    ? `Number of speakers: ${speakerCount}`
    : "Number of speakers: 1";
  fileObj = { ...fileObj, description: transcriptDescription };
  const fileDao = new FileDao();
  return await fileDao.createOrUpdateFile(fileObj);
};

