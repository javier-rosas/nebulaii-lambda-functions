import {
  createTranscript,
  createNotes,
  saveNotes,
  saveTranscript,
  saveFile,
} from "../helpers/index.mjs";

const createObj = (keys, data) => keys.reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});

export const mainHandler = async (fileData) => {
  try {
    const transcript = await createTranscript(fileData);
    const transcriptObj = createObj(["userEmail", "filename", "transcript"], fileData);
    await saveTranscript(transcriptObj, fileData.enableSpeakerDiarization);

    const notes = await createNotes(transcript);
    const notesObj = createObj(["userEmail", "filename", "notes"], fileData);
    await saveNotes(notesObj);

    const fileObj = createObj(["userEmail", "filename", "description", "dateAdded"], fileData);
    await saveFile(fileObj, fileData.enableSpeakerDiarization, fileData.speakerCount);

    return { transcript, notes };
  } catch (error) {
    console.log(error);
  }
};
