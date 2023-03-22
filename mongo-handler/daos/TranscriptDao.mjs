import TranscriptModel from "../mongoose/models/TranscriptModel.mjs";

export default class TranscriptDao {
  static transcriptDao = null;

  static getInstance = () => {
    if (TranscriptDao.transcriptDao === null) {
      TranscriptDao.transcriptDao = new TranscriptDao();
    }
    return TranscriptDao.transcriptDao;
  };

  constructor() {}

  createOrUpdateTranscript = async (transcriptObj) => {
    try {
      const filter = {
        userEmail: transcriptObj.userEmail,
        filename: transcriptObj.filename,
      };
      const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      };
      const transcriptDaoMongooseModel = await TranscriptModel.findOneAndUpdate(
        filter,
        transcriptObj,
        options
      );
      return transcriptDaoMongooseModel;
    } catch (err) {
      throw new Error("Error creating or updating transcript");
    }
  };

  getTranscriptsByUserEmail = async (userEmail) => {
    try {
      const transcripts = await TranscriptModel.find({userEmail});
      return transcripts;
    } catch (err) {
      throw new Error("Error getting transcripts by user email");
    }
  };

  getTranscriptByUserEmailAndFilename = async (userEmail, filename) => {
    try {
      const transcript = await TranscriptModel.findOne({
        userEmail,
        filename,
      });
      return transcript;
    } catch (err) {
      throw new Error("Error getting transcript by user email and filename");
    }
  };
}
