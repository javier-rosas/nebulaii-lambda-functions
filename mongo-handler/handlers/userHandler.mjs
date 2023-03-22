import { createResponse } from "../utils/createResponse.mjs";

/**
 * Creates or updates a user.
 *
 * @param {Object} event - The event object containing user and JWT data.
 * @param {Object} event.user - The decoded JWT data for the user.
 * @param {string} event.body - The request body containing the user data as a JSON string.
 * @returns {Promise<Object>} Returns a Promise that resolves with a response object containing the new user data or an error message.
 */
export const createOrUpdateUser = async (event, userDao) => {
  try {
    const userJwtDecoded = event.user;
    const user = JSON.parse(event.body);
    if (userJwtDecoded.email !== user.email) {
      throw new Error("Decoded user email and user email in body don't match.");
    }
    const newUser = await userDao.createOrUpdateUser(user);
    return createResponse(200, newUser);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};
