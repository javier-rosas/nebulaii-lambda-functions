import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucketName = process.env.GCP_BUCKET_NAME;

export const deleteFileFromGcpBucketByUserEmailAndFilename = async (
  userEmail,
  filename
) => {
  try {
    await storage.bucket(bucketName).file(`${userEmail}/${filename}`).delete();
    console.log(`gs://${bucketName}/${userEmail}/${filename} deleted.`);
    return true;
  } catch (err) {
    console.log("deleteFileFromGcpBucketByUserEmailAndFilename", err);
    return false;
  }
};
