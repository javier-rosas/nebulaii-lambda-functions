import FileModel from "../mongoose/models/FileModel.mjs";

export default class FileDao {
  static fileDao = null;

  static getInstance = () => {
    if (FileDao.fileDao === null) {
      FileDao.fileDao = new FileDao();
    }
    return FileDao.fileDao;
  };

  constructor() {}

  getFilesByUserEmail = async (userEmail) => {
    try {
      const file = await FileModel.find({ userEmail });
      return file;
    } catch (err) {
      throw new Error("Error getting file by user email");
    }
  };

  getFileByUserEmailAndFilename = async (userEmail, filename) => {
    try {
      const file = await FileModel.find({ userEmail, filename });
      return file;
    } catch (err) {
      throw new Error("Error getting file by user email and filename");
    }
  };
}
