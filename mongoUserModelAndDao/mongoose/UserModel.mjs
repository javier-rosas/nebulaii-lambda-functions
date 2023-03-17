import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  email_verified: {type: Boolean, required: true},
  family_name: { type: String },
  given_name: { type: String},
  locale: { type: String},
  name: { type: String},
  nickname: { type: String},
  picture: { type: String },
  sid: { type: String },
  sub: { type: String },
  updated_at: { type: String },
  accountType: { type: String, default: "BASIC", required: true },
}, { collection: 'users' });

const UserModel = mongoose.model("UserModel", userSchema);
export default UserModel
