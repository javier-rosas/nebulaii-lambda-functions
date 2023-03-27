import mongoose from "mongoose";
import FileModel from "../mongoose/models/FileModel.mjs";
import TranscriptModel from "../mongoose/models/TranscriptModel.mjs";
import NotesModel from "../mongoose/models/NotesModel.mjs";
import DiarizedTranscriptModel from "../mongoose/models/DiarizedTranscriptModel.mjs";
import { deleteFileFromGcpBucketByUserEmailAndFilename } from "../main/deleteFileFromGcpBucketByUserEmailAndFilename.mjs" 

export default class FileDao {
  static fileDao = null;

  static getInstance = () => {
    if (FileDao.fileDao === null) {
      FileDao.fileDao = new FileDao();
    }
    return FileDao.fileDao;
  };

  constructor() {}

  createOrUpdateFile = async (fileObj) => {
    try {
      const filter = {
        userEmail: fileObj.userEmail,
        filename: fileObj.filename,
      };
      const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      };
      const fileMongooseModel = await FileModel.findOneAndUpdate(
        filter,
        fileObj,
        options
      );
      return fileMongooseModel;
    } catch (err) {
      throw new Error("Error creating or updating file.");
    }
  };

  getFilesByUserEmail = async (userEmail) => {
    try {
      const file = await FileModel.find({ userEmail });
      return file;
    } catch (err) {
      throw new Error("Error getting files by user email");
    }
  };

  getFileByUserEmailAndFilename = async (userEmail, filename) => {
    try {
      const file = await FileModel.findOne({ userEmail, filename });
      return file;
    } catch (err) {
      throw new Error("Error getting file by user email and filename");
    }
  };

  deleteFileByUserEmailAndFilename = async (userEmail, filename) => {
    const isFileDeleted = await deleteFileFromGcpBucketByUserEmailAndFilename(
      userEmail,
      filename
    );
    console.log("isFileDeleted", isFileDeleted)
    if (isFileDeleted) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          await FileModel.findOneAndDelete(
            { userEmail, filename },
            { session }
          );
          await TranscriptModel.findOneAndDelete(
            { userEmail, filename },
            { session }
          );
          await NotesModel.findOneAndDelete(
            { userEmail, filename },
            { session }
          );
          await DiarizedTranscriptModel.findOneAndDelete(
            { userEmail, filename },
            { session }
          );
        });
      } catch (err) {
        console.log("deleteFileByUserEmailAndFilename", err);
        throw new Error("Error deleting file from MongoDB by user email and filename");
      } finally {
        session.endSession();
      }
    } else {
      throw new Error(
        "Error deleting file from GCP bucket by user email and filename"
      );
    }
  };
}
