import NotesModel from '../mongoose/models/NotesModel.mjs'


/**
 * Notes Dao
 */
export default class NotesDao {

  static notesDao = null;

  static getInstance = () => {
    if (NotesDao.notesDao === null) {
      NotesDao.notesDao = new NotesDao();
    }
    return NotesDao.notesDao;
  }

  constructor() { }

  createTranscript = async (notesObj) => {
    NotesModel.create(notesObj)
  }  

}