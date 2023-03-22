/**
 * Creates a success response object.
 * @param {object} mongoTranscriptModel - The transcript object returned from MongoDB.
 * @param {object} notesMongooseModel - The notes object returned from Mongoose.
 * @returns {object} The success response object.
 */
export const createSuccessResponse = (transcript, notes) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      status: 200,
      message: "File processed succesfully.",
      transcript,
      notes,
    }),
  };
};