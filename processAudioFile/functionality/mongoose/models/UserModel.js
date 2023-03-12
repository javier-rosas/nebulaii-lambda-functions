import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profilePhoto: { type: String },
  accountType: { type: String, default: "BASIC" }
}, { collection: 'users' });

const UserModel = mongoose.model("UserModel", userSchema);
export default UserModel
