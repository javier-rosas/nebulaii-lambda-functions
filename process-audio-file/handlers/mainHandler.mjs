import { createTranscript } from "../helpers/createTranscript.mjs";
import { createNotes } from "../helpers/createNotes.mjs";
import { saveNotes } from "../helpers/saveNotes.mjs";
import { saveTranscript } from "../helpers/saveTranscript.mjs";
import { saveFile } from "../helpers/saveFile.mjs";

/**
 * Handle an AWS Lambda event.
 */
export const mainHandler = async (
  userEmail,
  filename,
  language,
  enableSpeakerDiarization,
  speakerCount,
  description,
  dateAdded
) => {
  try {
    // create transcript using google speech-to-text api
    const transcript = await createTranscript(
      filename,
      language,
      enableSpeakerDiarization,
      speakerCount,
      userEmail
    );

    // create transcript object to store in database
    const transcriptObj = {
      userEmail,
      filename,
      transcript,
    };

    // save transcript to database
    await saveTranscript(transcriptObj, enableSpeakerDiarization);

    // create notes using gpt-3.5 api
    const notes = await createNotes(transcript);

    // create notes object to store in database
    const notesObj = {
      userEmail,
      filename,
      notes,
    };

    // save notes to database
    await saveNotes(notesObj);

    // create file object to store in database
    const fileObj = {
      userEmail,
      filename,
      description,
      dateAdded,
    };

    // save file to database
    await saveFile(fileObj, enableSpeakerDiarization, speakerCount);
    
    return { transcript, notes };
  } catch (error) {
    console.log(error);
  }
};
