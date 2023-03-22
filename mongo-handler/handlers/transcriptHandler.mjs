import { createResponse } from "../utils/createResponse.mjs";


export const getTranscriptsByUserEmail = async (event, transcriptDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const transcripts = await transcriptDao.getTranscriptsByUserEmail(userEmail);
    return createResponse(200, transcripts);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
}

export const getTranscriptByUserEmailAndFilename = async (event, transcriptDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const transcript = await transcriptDao.getTranscriptByUserEmailAndFilename(userEmail);
    return createResponse(200, transcript);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};


