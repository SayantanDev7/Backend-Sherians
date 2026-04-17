const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image:String, //string because image will be in URL form
    caption:String,
});

//creating model for post
const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
