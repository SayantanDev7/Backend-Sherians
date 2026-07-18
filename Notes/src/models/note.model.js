const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({ //noteSchema denotes the structure of the document that we are going to store in the database 
    title:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String
    }
})


const noteModel = mongoose.model("Note",noteSchema); //model is used to perform CRUD operations on the database 
module.exports = noteModel;