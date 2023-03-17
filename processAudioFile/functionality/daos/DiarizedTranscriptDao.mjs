import DiarizedTranscriptModel from '../mongoose/models/DiarizedTranscriptModel.mjs'

/**
 * DiarizedTranscript Dao
 */
export default class DiarizedTranscriptDao {

  static diarizedTranscriptDao = null;

  static getInstance = () => {
    if (DiarizedTranscriptDao.diarizedTranscriptDao === null) {
      DiarizedTranscriptDao.diarizedTranscriptDao = new DiarizedTranscriptDao();
    }
    return DiarizedTranscriptDao.diarizedTranscriptDao;
  }

  constructor() { }

  createDiarizedTranscript = async (transcriptObj) => {
    DiarizedTranscriptModel.create(transcriptObj)
  }  

}