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