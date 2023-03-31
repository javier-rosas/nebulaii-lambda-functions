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
    console.log("main handler", fileData)
    const transcript = await createTranscript(fileData);
    const transcriptObj = createObj(["userEmail", "filename", "transcript"], {...fileData, transcript});
    await saveTranscript(transcriptObj, fileData.enableSpeakerDiarization);

    const notes = await createNotes(transcript);
    const notesObj = createObj(["userEmail", "filename", "notes"], {...fileData, notes});
    await saveNotes(notesObj);

    const fileObj = createObj(["userEmail", "filename", "description", "dateAdded"], fileData);
    await saveFile(fileObj, fileData.enableSpeakerDiarization, fileData.minSpeakerCount);

    return { transcript, notes };
  } catch (error) {
    console.log(error);
  }
};
