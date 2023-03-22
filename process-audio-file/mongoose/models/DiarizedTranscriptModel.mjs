import mongoose from "mongoose";

const diarizedTranscriptSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  filename: { type: String, required: true },
  transcript: [
    {
      speakerTag: { type: Number, required: true },
      sentence: { type: String, required: true },
    },
  ],
  }, { collection: "diarized_transcripts" });

const DiarizedTranscriptModel = mongoose.model(
  "DiarizedTranscriptModel",
  diarizedTranscriptSchema
);
export default DiarizedTranscriptModel;
