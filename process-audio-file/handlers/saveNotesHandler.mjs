import NotesDao from "../daos/NotesDao.mjs";

export const saveNotesHandler = async (notesObj) => {

  console.log("here 7")

  const notesDao = new NotesDao();
  
  return await notesDao.createOrUpdateNotes(notesObj);
};
