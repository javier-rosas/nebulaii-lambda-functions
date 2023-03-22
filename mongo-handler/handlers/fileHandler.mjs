import { createResponse } from "../utils/createResponse.mjs";

/**
 * Returns a list of files for a given user
 * @param {*} event 
 * @param {*} fileDao 
 * @returns {Promise<Object>} Returns a Promise that resolves with a response object containing the list of files or an error message.
 */
export const getFilesByUserEmail = async (event, fileDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const files = await fileDao.getFilesByUserEmail(userEmail);
    return createResponse(200, files);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};