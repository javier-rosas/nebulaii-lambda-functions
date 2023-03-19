import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { createOrUpdateUserHandler } from "./helpers.mjs"
import { getUserAudioFileDataHandler } from "./helpers.mjs"
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import { createResponse } from "./helpers.mjs";
import UserDao from "./daos/UserDao.mjs";



const jwtSecret = process.env.JWT_SECRET;

/**
 * The main Lambda function handler.
 * @async
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} - The response object.
 */
const mainHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await mongooseConnect();
  const userDao = new UserDao();
  if (event.routeKey === "POST /mongoUserHandler/user") {
    return await createOrUpdateUserHandler(event, userDao)
  } else if (event.routeKey === "GET /mongoUserHandler/user/{userEmail}") {
    return await getUserAudioFileDataHandler(event, userDao)
  } else {
    return createResponse(404, { error: "Not Found" });
  }
};

/**
 * A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 *
 * @constant
 * @type {function}
 * @param {function} myHandler - The AWS Lambda handler function to be wrapped with middleware.
 * @returns {function} - A middleware-wrapped AWS Lambda handler function that uses a JWT token for authentication.
 */
export const handler = middy(mainHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
