// ImageKit is a Media Optimization and Delivery service that helps developers
// manage and deliver digital assets like images and videos more efficiently.

import ImageKit, { toFile } from "@imagekit/nodejs";
import mongoose from "mongoose";
import client from "../config/storage-service.js";

// client = initialized ImageKit instance (see config/storage-service.js)

const DEFAULT_FOLDER = "/social-media";

/**
 * Uploads a file buffer (e.g. from multer) to ImageKit.
 * @param {object} file - multer file object: { buffer, originalname, mimetype, size }
 * @param {object} [options]
 * @param {string} [options.folder] - override destination folder
 */
async function uploadFile(file, { folder = DEFAULT_FOLDER } = {}) {
  try {
    const result = await client.files.upload({
      file: await toFile(file.buffer, file.originalname),
      // ObjectId + original extension avoids collisions and strips any
      // client-supplied filename weirdness (spaces, unicode, path traversal attempts)
      fileName: `${new mongoose.Types.ObjectId().toString()}.${file.originalname.split(".").pop()}`,
      folder,
    });

    console.log(
      `[ImageKit] Upload succeeded: ${result.name} (${result.fileType}, ${result.size} bytes) -> ${result.url}`
    );

    return result;
  } catch (error) {
    if (error instanceof ImageKit.APIError) {
      console.error(
        `ImageKit upload failed [${error.status}] ${error.name}: ${error.message}`
      );
    } else {
      console.error("Unexpected upload error:", error.message);
      if (process.env.NODE_ENV !== "production") {
        console.error(error.stack);
      }
    }
    throw error;
  }
}

export default uploadFile;