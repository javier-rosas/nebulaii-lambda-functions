import { Storage } from "@google-cloud/storage";

const storage = new Storage();

/**
 * Uploads an audio file to a Google Cloud Storage bucket.
 * @param {string} bucketName - The name of the bucket to upload the file to.
 * @param {string} audioFile - The local path of the audio file to upload.
 * @param {string} destinationFilename - The name of the file to create in the bucket.
 * @returns {Promise<{ statusCode: number, body: string }>} A Promise that resolves to a JSON object containing a status code and message.
 */
export async function uploadAudioFileToBucket(
  bucketName,
  audioFile,
  destinationFilename
) {
  try {
    const file = storage.bucket(bucketName).file(destinationFilename);
    await file.save(audioFile);
    console.log(
      `Audio file ${audioFile} uploaded to bucket ${bucketName} as ${destinationFilename}.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Audio file uploaded successfully." }),
    };
  } catch (err) {
    console.error(`Error uploading audio file to bucket: ${err}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading audio file to bucket.",
      }),
    };
  }
}