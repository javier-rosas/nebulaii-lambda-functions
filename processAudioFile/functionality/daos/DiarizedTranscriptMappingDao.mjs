import DiarizedTranscriptMappingModel from '../mongoose/models/DiarizedTranscriptMappingModel.mjs'


/**
 * DiarizedTranscriptMapping Dao
 */
export default class DiarizedTranscriptMappingDao {

  static diarizedTranscriptMappingDao = null;

  static getInstance = () => {
    if (DiarizedTranscriptMappingDao.diarizedTranscriptMappingDao === null) {
      DiarizedTranscriptMappingDao.diarizedTranscriptMappingDao = new DiarizedTranscriptMappingDao();
    }
    return DiarizedTranscriptMappingDao.diarizedTranscriptMappingDao;
  }

  constructor() { }

  createTranscript = async (mappingObj) => {
    DiarizedTranscriptMappingModel.create(mappingObj)
  }  

}