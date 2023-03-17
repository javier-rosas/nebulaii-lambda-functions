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

  createOrUpdateDiarizedTranscript = async (transcriptObj) => {
    const filter = { 
      userEmail: transcriptObj.userEmail,
      filename: transcriptObj.filename
     };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true };
    const diarizedTranscriptDaoMongooseModel = await DiarizedTranscriptModel.findOneAndUpdate(filter, transcriptObj, options);
    return diarizedTranscriptDaoMongooseModel;
  }  

}