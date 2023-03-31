import { mainHandler } from "./mainHandler.mjs";
import { uploadYoutubeAudioToGcpByUserEmailAndFilename } from "../main/gcpFunctions.mjs";
import { createResponse } from "../utils/createResponse.mjs";

export const processYoutubeFile = async (fileData) => {
  try {
    const res = await uploadYoutubeAudioToGcpByUserEmailAndFilename(fileData.userEmail, fileData.filename)
    console.log("res", res)
    const { transcript, notes } = await mainHandler(fileData);
    return createResponse(200, { transcript, notes });
  } catch (error) {
    console.log(error);
    return createResponse(500, { error: error.message });
  }
};
