/**
 * Creates an error response object.
 * @returns {object} The error response object.
 */
export const createErrorResponse = () => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      ok: false,
      status: 500,
      error: "Internal server error",
    }),
  };
};