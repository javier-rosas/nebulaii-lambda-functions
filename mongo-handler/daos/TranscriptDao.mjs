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

  getTranscript = async (userEmail, filename) => {
    try {
      const transcript = await TranscriptModel.find({ userEmail, filename });
      return transcript;
    } catch (err) {
      throw new Error("Error creating or updating user");
    }
  };
}
