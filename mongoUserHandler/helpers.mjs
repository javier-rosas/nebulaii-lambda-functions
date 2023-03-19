/**
 * Creates a response object with a given status code and body.
 * @param {number} statusCode - The HTTP status code to return.
 * @param {object} body - The response body.
 * @returns {object} - The response object.
 */
export const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

/**
 * Creates or updates a user.
 *
 * @async
 * @function createOrUpdateUser
 * @param {Object} event - The event object containing user and JWT data.
 * @param {Object} event.user - The decoded JWT data for the user.
 * @param {string} event.body - The request body containing the user data as a JSON string.
 * @returns {Promise<Object>} Returns a Promise that resolves with a response object containing the new user data or an error message.
 * @throws {Error} Throws an error if there is an issue creating or updating the user.
 */
export const createOrUpdateUserHandler = async (event, userDao) => {
  try {
    const userJwtDecoded = event.user;
    const user = JSON.parse(event.body);
    if (userJwtDecoded.email !== user.email) {
      throw new Error("Decoded user email and user email in body don't match");
    }
    const newUser = await userDao.createOrUpdateUser(user);
    return createResponse(200, newUser);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};


/**
 * Handles retrieving user audio file data (diarized transcripts, notes, and transcripts) for a specific user.
 *
 * @function
 * @async
 * @param {Object} event - The event object containing request information.
 * @param {Object} event.pathParameters - The path parameters of the request.
 * @param {string} event.pathParameters.userEmail - The email of the user for whom to fetch audio file data.
 * @param {Object} userDao - The data access object for user-related database operations.
 * @param {function} userDao.getUserAudioFileData - Function to fetch user audio file data from the database.
 * @returns {Promise<Object>} A promise that resolves with a response object containing the status code and the retrieved data.
 * @throws {Error} If there is an error while fetching the data, an error response object is returned.
 */
export const getUserAudioFileDataHandler = async (event, userDao) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const userAudioFileData = await userDao.getUserAudioFileData(userEmail);
    return createResponse(200, userAudioFileData);
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};
