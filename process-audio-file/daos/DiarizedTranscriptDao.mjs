import DiarizedTranscriptModel from "../mongoose/models/DiarizedTranscriptModel.mjs";

export default class DiarizedTranscriptDao {
  static diarizedTranscriptDao = null;

  static getInstance = () => {
    if (DiarizedTranscriptDao.diarizedTranscriptDao === null) {
      DiarizedTranscriptDao.diarizedTranscriptDao = new DiarizedTranscriptDao();
    }
    return DiarizedTranscriptDao.diarizedTranscriptDao;
  };

  constructor() {}

  createOrUpdateDiarizedTranscript = async (transcriptObj) => {
    console.log("createOrUpdateDiarizedTranscript", transcriptObj)
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
      const diarizedTranscriptDaoMongooseModel =
        await DiarizedTranscriptModel.findOneAndUpdate(
          filter,
          transcriptObj,
          options
        );
      return diarizedTranscriptDaoMongooseModel;
    } catch (e) {
      throw new Error("Error creating or updating diarized transcript");
    }
  };

  getDiarizedTranscriptsByUserEmail = async (userEmail) => {
    try {
      const diarizedTranscriptModels = await DiarizedTranscriptModel.find({
        userEmail,
      });
      return diarizedTranscriptModels;
    } catch (err) {
      throw new Error("Error getting diarized transcripts by user email");
    }
  };

  getDiarizedTranscriptByUserEmailAndFilename = async (userEmail, filename) => {
    try {
      const diarizedTranscriptModel = await DiarizedTranscriptModel.findOne({
        userEmail,
        filename,
      });
      console.log("diarizedTranscriptModel in DiarizedTranscriptDao: ", diarizedTranscriptModel)
      return diarizedTranscriptModel;
    } catch (err) {
      throw new Error(
        "Error getting diarized transcript by user email and filename"
      );
    }
  };
}
