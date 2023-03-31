import { mainHandler } from "./mainHandler.mjs";
import { convertFileToWavAndUploadToGcp } from "../main/gcpFunctions.mjs";
import { createResponse } from "../utils/createResponse.mjs";

const ALLOWED_FILE_TYPES = ['audio/mpeg','audio/mp3', 'audio/mp4', 'audio/wav', 'audio/m4a']

export const processAudioFile = async (fileData) => {
  try {
    const fileType = fileData.fileType;
    console.log("fileType: ", fileType);

    if (!ALLOWED_FILE_TYPES.includes(fileType))
      throw new Error("File type not allowed.");

    if (fileType !== "audio/wav")
      await convertFileToWavAndUploadToGcp(fileData.userEmail, fileData.filename);

    const { transcript, notes } = await mainHandler(fileData);

    return createResponse(200, { transcript, notes });
  } catch (error) {
    console.log(error);
    return createResponse(500, { error: error.message });
  }
};
