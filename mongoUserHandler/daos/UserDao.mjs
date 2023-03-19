import UserModel from "../mongoose/models/UserModel.mjs";
import DiarizedTranscriptModel from "../mongoose/models/DiarizedTranscriptModel.mjs";
import NotesModel from "../mongoose/models/NotesModel.mjs";
import TranscriptModel from "../mongoose/models/TranscriptModel.mjs";

export default class UserDao {
  static userDao = null;

  static getInstance = () => {
    if (UserDao.userDao === null) {
      UserDao.userDao = new UserDao();
    }
    return UserDao.userDao;
  };

  constructor() {}

  createOrUpdateUser = async (user) => {
    try {
      const filter = { email: user.email };
      const update = user;
      const options = { new: true, upsert: true, setDefaultsOnInsert: true };
      const newUser = await UserModel.findOneAndUpdate(filter, update, options);
      return newUser;
    } catch (err) {
      console.log(err);
      throw new Error("Error creating or updating user");
    }
  };

  getUserAudioFileData = async (userEmail) => {
    try {
      const diarizedTranscripts = await DiarizedTranscriptModel.find({
        userEmail,
      });
      const notes = await NotesModel.find({ userEmail });
      const transcripts = await TranscriptModel.find({ userEmail });
      return {
        diarizedTranscripts,
        notes,
        transcripts,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Error creating or updating user");
    }
  };
}
