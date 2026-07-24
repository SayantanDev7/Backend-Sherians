import ImageKit, { toFile } from "@imagekit/nodejs";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

console.log("ImageKit instance:", imagekit);
console.log("ImageKit files:", imagekit.files);

async function uploadFile(file) {
  try {
    const result = await imagekit.files.upload({
      file: await toFile(file.buffer, file.originalname),
      fileName: file.originalname,
      folder: "/songs",
    });

    return result;
  } catch (error) {
      console.error(error.stack);
    throw error;
  }
}

export default uploadFile;