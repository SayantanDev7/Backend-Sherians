//we separete create a storage file to handle all the storage related operations like uploading files to cloudinary and getting the url of the uploaded file
//the one cloud storage serveice that gives good service in less cost we will consider that

//for now we will be using imagekit

const ImageKit = require('@imagekit/nodejs').default; // ✅ IMPORTANT
require("dotenv").config();
/*
Reads .env file
Loads variables into process.env
*/

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(buffer, fileName) {
    try {
        const result = await imagekit.files.upload({  // ✅ FIX HERE
            file: buffer.toString("base64"),
            fileName: fileName || `image_${Date.now()}.jpg`
        });

        console.log("✅ Uploaded:", result.url);

        return result; // ✅ important

    } catch (error) {
        console.error("❌ Upload error:", error.message);
        throw error;
    }
}

module.exports = uploadFile;