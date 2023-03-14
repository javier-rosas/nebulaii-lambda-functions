import { TranscriptModel } from '../mongoose/TranscriptModel'

export default class TranscriptDao {

  static transcriptDao = null;

  static getInstance = () => {
    if (TranscriptDao.transcriptDao === null) {
      TranscriptDao.transcriptDao = new BookmarkDao();
    }
    return TranscriptDao.transcriptDao;
  }

  constructor() { }

  createTranscript = async (userId, fileName, description, dateAdded, transcript) => {
    TranscriptModel.create({ userId, fileName, description, dateAdded, transcript })
  }  

}