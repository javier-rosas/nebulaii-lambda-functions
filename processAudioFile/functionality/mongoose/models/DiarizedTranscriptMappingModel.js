import mongoose from "mongoose";

const DiarizedTranscriptMappingModelSchema = new mongoose.Schema({
  diarizedTranscriptId: { type: Schema.Types.ObjectId, ref: "DiarizedTranscriptModel" },
  userId: { type: Schema.Types.ObjectId, ref: "UserModel" },
}, { collection: "diarized_transcript_mappings" });

const DiarizedTranscriptMappingModel = mongoose.model("DiarizedTranscriptMappingModel", DiarizedTranscriptMappingModelSchema);
export default DiarizedTranscriptMappingModel;