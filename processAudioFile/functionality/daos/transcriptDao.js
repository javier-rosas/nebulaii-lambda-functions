import { transcriptModel } from '../mongoose/transcriptModel'

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
    transcriptModel.create({ userId, fileName, description, dateAdded, transcript })
  }  

}