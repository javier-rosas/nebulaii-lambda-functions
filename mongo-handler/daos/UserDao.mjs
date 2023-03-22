import UserModel from "../mongoose/models/UserModel.mjs";

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
      throw new Error("Error creating or updating user");
    }
  };
}
