import { Storage } from "@google-cloud/storage";
import ytdl  from "ytdl-core"


const storage = new Storage();
const BUCKET_NAME = process.env.GCP_BUCKET_NAME;

export const deleteFileFromGcpBucketByUserEmailAndFilename = async (
  userEmail,
  filename
) => {
  try {
    await storage.bucket(BUCKET_NAME).file(`${userEmail}/${filename}`).delete();
    console.log(`gs://${BUCKET_NAME}/${userEmail}/${filename} deleted.`);
    return true;
  } catch (err) {
    console.log("deleteFileFromGcpBucketByUserEmailAndFilename", err);
    return false;
  }
};


export const uploadYoutubeAudioToGcpByUserEmailAndFilename = async (userEmail, filename) => {
  try {
    // Set the YouTube video URL
    const videoUrl = filename;

    // Set the options for the audio format and quality
    const options = {
      quality: 'highestaudio',
      filter: 'audioonly',
      format: 'wav'
    };

    const videoMetadata = await ytdl.getInfo(videoUrl);
    const videoTitle = videoMetadata.videoDetails.title;
    console.log(videoTitle);

    // Set the name of the GCS bucket and the file name for the audio
    const fileName = `${userEmail}/${videoUrl}.wav`;

    // Create a GCS client and a writable stream for the audio file
    const audioStream = storage.bucket(BUCKET_NAME).file(fileName).createWriteStream();

    // Download the audio from the video and pipe it to the GCS writable stream
    ytdl(videoUrl, options).pipe(audioStream);

    // Return a promise that resolves when the upload is complete
    return new Promise((resolve, reject) => {
      audioStream.on('finish', () => {
        console.log(`Audio uploaded to gs://${BUCKET_NAME}/${fileName}`);
        resolve();
      });

      audioStream.on('error', (err) => {
        console.error(err);
        reject(err);
      });
    });

    // TODO: DELETE AUDIO FILE FROM GCP, but only after it has been processed
  } catch (error) {
    console.error('An error occurred:', error);
  }
}