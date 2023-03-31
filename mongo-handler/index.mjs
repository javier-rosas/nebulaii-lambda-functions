import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { createOrUpdateUser } from "./handlers/userHandler.mjs";
import { getTranscriptByUserEmailAndFilename } from "./handlers/transcriptHandler.mjs";
import { getNoteByUserEmailAndFilename } from "./handlers/notesHandler.mjs";
import { deleteFileByUserEmailAndFilename } from "./handlers/fileHandler.mjs";
import { getDiarizedTranscriptByUserEmailAndFilename } from "./handlers/diarizedTranscriptHandler.mjs";
import { getFilesByUserEmail } from "./handlers/fileHandler.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createResponse } from "./utils/createResponse.mjs";
import UserDao from "./daos/UserDao.mjs";
import FileDao from "./daos/FileDao.mjs";
import TranscriptDao from "./daos/TranscriptDao.mjs";
import NotesDao from "./daos/NotesDao.mjs";
import DiarizedTranscriptDao from "./daos/DiarizedTranscriptDao.mjs";

const jwtSecret = process.env.JWT_SECRET;

/**
 * The main Lambda function handler.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} - The response object.
 */
const mainHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await mongooseConnect();
    const userDao = new UserDao();
    const fileDao = new FileDao();
    const transcriptDao = new TranscriptDao();
    const notesDao = new NotesDao();
    const diarizedTranscriptDao = new DiarizedTranscriptDao();
    switch (event.routeKey) {
      case "POST /api/v1/user":
        return await createOrUpdateUser(event, userDao);
      case "GET /api/v1/user/{userEmail}/files":
        return await getFilesByUserEmail(event, fileDao);
      case "GET /api/v1/user/{userEmail}/transcript/{filename}":
        return await getTranscriptByUserEmailAndFilename(event, transcriptDao);
      case "GET /api/v1/user/{userEmail}/diarized-transcript/{filename}":
        return await getDiarizedTranscriptByUserEmailAndFilename(event, diarizedTranscriptDao);
      case "GET /api/v1/user/{userEmail}/note/{filename}":
        return await getNoteByUserEmailAndFilename(event, notesDao);
      case "DELETE /api/v1/user/{userEmail}/file/{filename}":
        return await deleteFileByUserEmailAndFilename(event, fileDao);
      default:
        return createResponse(404, { error: "Not Found" });
    }
  } catch (e) {
    console.error(e);
    return createResponse(500, { error: "Internal Server Error" });
  }

};

/**
 * A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 * @param {function} myHandler - The AWS Lambda handler function to be wrapped with middleware.
 * @returns {function} - A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 */
export const handler = middy(mainHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
