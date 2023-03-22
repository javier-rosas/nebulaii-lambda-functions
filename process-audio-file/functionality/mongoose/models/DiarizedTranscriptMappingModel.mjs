import mongoose from "mongoose";

const diarizedTranscriptMappingModelSchema = new mongoose.Schema({
  diarizedTranscriptId: {
    type: Schema.Types.ObjectId,
    ref: "DiarizedTranscriptModel",
  },
  userEmail: { type: String, ref: "UserModel" },
  }, { collection: "diarized_transcript_mappings" });

const DiarizedTranscriptMappingModel = mongoose.model(
  "DiarizedTranscriptMappingModel",
  diarizedTranscriptMappingModelSchema
);
export default DiarizedTranscriptMappingModel;
