import mongoose from 'mongoose'

const notesSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  filename: { type: String, required: true },
  notes: { type: String, required: true },
}, { collection: "notes" });

const NotesModel = mongoose.model("NotesModel", notesSchema);
export default NotesModel