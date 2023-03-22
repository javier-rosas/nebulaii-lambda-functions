import mongoose from "mongoose"

const transcriptSchema = new mongoose.Schema ({
  userEmail: { type: String, required: true },
  filename: { type: String, required: true },
  transcript: { type: String, required: true }
}, { collection: "transcripts" })

const TranscriptModel = mongoose.model("TranscriptModel", transcriptSchema);
export default TranscriptModel