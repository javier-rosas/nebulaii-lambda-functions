import { createResponse } from "../utils/createResponse.mjs";

export const getDiarizedTranscriptsByUserEmail = async (event, diarizedTranscriptDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const diarizedTranscripts = await diarizedTranscriptDao.getDiarizedTranscriptsByUserEmail(userEmail);
    return createResponse(200, diarizedTranscripts);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
}

export const getDiarizedTranscriptByUserEmailAndFilename = async (event, diarizedTranscriptDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const diarizedTranscript = await diarizedTranscriptDao.getDiarizedTranscriptByUserEmailAndFilename(userEmail);
    return createResponse(200, diarizedTranscript);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};