import ImageKit, { toFile } from "@imagekit/nodejs";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

//imagekit initialization
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// console.log("ImageKit instance:", imagekit);
// console.log("ImageKit files:", imagekit.files);

async function uploadFile(file) {
  try {
    const result = await imagekit.files.upload({
      file: await toFile(file.buffer, file.originalname),
      // We convert the ObjectId to a string and append the original file extension (e.g., .mp3)
      fileName: `${new mongoose.Types.ObjectId().toString()}.${file.originalname.split('.').pop()}`,
      // fileName: file.originalname,  //  The filename is stored as "24-07-25T01_01_01_462Z_240725-010101_462Z_song1_4a6fa8a1-8291-46ab-942a-fbc3e0bf6005.mp3" in the server
      folder: "/songs",
    });

    return result;
  } catch (error) {
      console.error(error.stack);
    throw error;
  }
}

export default uploadFile;