import DiarizedTranscriptDao from "../daos/DiarizedTranscriptDao.mjs";
import TranscriptDao from "../daos/TranscriptDao.mjs";


/**
 * Save a transcript object to the appropriate DAO.
 * @param {Object} transcriptObj - An object containing information about a transcript.
 * @param {string} transcriptObj.userEmail - The email address of the user who created the transcript.
 * @param {string} transcriptObj.filename - The name of the audio file that was transcribed.
 * @param {string} transcriptObj.transcript - The text of the transcript.
 * @param {boolean} enableSpeakerDiarization - Whether to enable speaker diarization.
 * @returns {Promise<Object>} - A Promise that resolves with the MongoDB model of the saved transcript.
 */
export const saveTranscript = async (transcriptObj, enableSpeakerDiarization) => {
  console.log("here 5")

  if (enableSpeakerDiarization) {
    const diarizedTranscriptDao = new DiarizedTranscriptDao();
    return await diarizedTranscriptDao.createOrUpdateDiarizedTranscript(
      transcriptObj
    );
  } else {
    const transcriptDao = new TranscriptDao();
    return await transcriptDao.createOrUpdateTranscript(transcriptObj);
  }
};