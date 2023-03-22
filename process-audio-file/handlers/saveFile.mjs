import FileDao from "../daos/FileDao.mjs";

/**
 * Save file data to database.
 * @param {*} fileObj 
 * @param {boolean} enableSpeakerDiarization 
 * @param {number} speakerCount 
 * @returns mongoose file object model
 */
export const saveFile = async (
  fileObj,
  enableSpeakerDiarization,
  speakerCount
) => {
  console.log("here 8", fileObj)
  const transcriptDescription = enableSpeakerDiarization
    ? `Number of speakers: ${speakerCount}`
    : "Number of speakers: 1";

  fileObj.description = transcriptDescription;

  const fileDao = new FileDao();

  return await fileDao.createOrUpdateFile(fileObj);
};
