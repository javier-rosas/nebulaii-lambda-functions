import { createResponse } from "../utils/createResponse.mjs";

export const getNotesByUserEmail = async (event, noteDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const notes = await noteDao.getNotesByUserEmail(userEmail);
    return createResponse(200, notes);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
}

export const getNoteByUserEmailAndFilename = async (event, noteDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const filename = event.pathParameters.filename;
    const notes = await noteDao.getNoteByUserEmailAndFilename(userEmail, filename);
    return createResponse(200, notes);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
}