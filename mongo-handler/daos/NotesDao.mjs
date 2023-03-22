import NotesModel from "../mongoose/models/NotesModel.mjs";

export default class NotesDao {
  static notesDao = null;

  static getInstance = () => {
    if (NotesDao.notesDao === null) {
      NotesDao.notesDao = new NotesDao();
    }
    return NotesDao.notesDao;
  };

  constructor() {}

  getNotes = async (userEmail, filename) => {
    try {
      const notes = await NotesModel.find({ userEmail, filename });
      return notes;
    } catch (err) {
      throw new Error("Error creating or updating user");
    }
  };
}
