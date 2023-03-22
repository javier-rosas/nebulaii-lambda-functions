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

  getDiarizedTranscript = async (userEmail, filename) => {
    try {
      const diarizedTranscript = await DiarizedTranscriptModel.find({
        userEmail,
        filename,
      });
      return diarizedTranscript;
    } catch (err) {
      throw new Error("Error creating or updating user");
    }
  };
}
