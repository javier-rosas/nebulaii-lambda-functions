import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs";
import UserDao from "./daos/UserDao.mjs";

const jwtSecret = process.env.JWT_SECRET;

/**
 * Creates a new user or updates an existing one in the database.
 * @async
 * @param {object} userJwtDecoded - Decoded JWT token for the user.
 * @param {object} user - User data to create or update.
 * @returns {Promise<object>} - The created or updated user object.
 * @throws {Error} - If the email in the JWT token and the email in the user data don't match.
 */
const createUserOrUpdate = async (userJwtDecoded, user) => {
  if (userJwtDecoded.email !== user.email) {
    throw new Error("Decoded user email and user email in body don't match");
  }

  await mongooseConnect();
  const userDao = new UserDao();
  const newUser = await userDao.createOrUpdateUser(user);
  return newUser;
};

/**
 * Creates a response object with a given status code and body.
 * @param {number} statusCode - The HTTP status code to return.
 * @param {object} body - The response body.
 * @returns {object} - The response object.
 */
const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

/**
 * The main Lambda function handler.
 * @async
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} - The response object.
 */
const mainHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const userJwtDecoded = event.user;
    const user = JSON.parse(event.body);
    const newUser = await createUserOrUpdate(userJwtDecoded, user);
    return createResponse(200, newUser);
  } catch (error) {
    console.log("error", error);
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
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
