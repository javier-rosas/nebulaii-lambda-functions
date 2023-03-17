import TranscriptModel from '../mongoose/models/TranscriptModel.mjs'

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
  }

  constructor() { }

  createTranscript = async (transcriptObj) => {
    TranscriptModel.create(transcriptObj)
  }  

}