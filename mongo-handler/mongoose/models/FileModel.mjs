import mongoose from "mongoose"

const fileSchema = new mongoose.Schema ({
  userEmail: { type: String, required: true },
  filename: { type: String, required: true },
  description: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now, required: true },
}, { collection: "files" })

const FileModel = mongoose.model("FileModel", fileSchema);
export default FileModel