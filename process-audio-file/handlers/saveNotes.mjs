import NotesDao from "../daos/NotesDao.mjs";

export const saveNotes = async (notesObj) => {
  const notesDao = new NotesDao();

  return await notesDao.createOrUpdateNotes(notesObj);
};
