const express = require('express');
const multer = require('multer');
const  uploadFile = require("../services/storage.service");

const app = express(); 
app.use(express.json()); //can handle only json data

//multer is the middleware used to handle file uploads in express
//memoryStorage Stores file in RAM (temporary
const upload = multer({storage:multer.memoryStorage()});

app.post('/create-post',upload.single("image"),async (req,res) =>{
    try {
        console.log(req.body);
        console.log(req.file);

        // 🔥 THIS IS THE IMPORTANT LINE
        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname
        );

        console.log("IMAGEKIT RESPONSE:", result);

        res.json({
            message: "Uploaded successfully",
            url: result.url
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
module.exports = app;

 