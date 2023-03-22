import TranscriptModel from "../mongoose/models/TranscriptModel.mjs";

/**
 * Transcript Dao
 */
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
      console.log(err);
      throw new Error("Error creating or updating transcript");
    }
  };
}
