import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { createOrUpdateUserHandler } from "./handlers/userHandler.mjs";
import { getFilesByUserEmailHandler } from "./handlers/fileHandler.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createResponse } from "./utils/responseUtils.mjs";
import UserDao from "./daos/UserDao.mjs";
import FileDao from "./daos/FileDao.mjs";

const jwtSecret = process.env.JWT_SECRET;

/**
 * The main Lambda function handler.
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} - The response object.
 */
const mainHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await mongooseConnect();
  const userDao = new UserDao();
  const fileDao = new FileDao();
  switch (event.routeKey) {
    case "POST /api/v1/user":
      return await createOrUpdateUserHandler(event, userDao);
    case "GET /api/v1/user/{userEmail}/files":
      return await getFilesByUserEmailHandler(event, fileDao);
    default:
      return createResponse(404, { error: "Not Found" });
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
