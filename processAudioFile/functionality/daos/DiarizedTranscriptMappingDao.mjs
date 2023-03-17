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

  createTranscriptMapping = async (mappingObj) => {
    DiarizedTranscriptMappingModel.create(mappingObj)
  }  

}