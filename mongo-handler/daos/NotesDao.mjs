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

  createOrUpdateNotes = async (notesObj) => {
    try {
      const filter = {
        userEmail: notesObj.userEmail,
        filename: notesObj.filename,
      };
      const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      };
      const notesMongooseModel = await NotesModel.findOneAndUpdate(
        filter,
        notesObj,
        options
      );
      return notesMongooseModel;
    } catch (err) {
      throw new Error("Error creating or updating notes");
    }
  }

  getNotesByUserEmail = async (userEmail) => {
    try {
      const notes = await NotesModel.find({userEmail});
      return notes;
    } catch (err) {
      throw new Error("Error getting notes by user email");
    }
  };

  getNoteByUserEmailAndFilename = async (userEmail, filename) => {
    try {
      const note = await NotesModel.find({
        userEmail,
        filename,
      });
      return note;
    } catch (err) {
      throw new Error("Error getting notes by user email and filename");
    }
  };
}
