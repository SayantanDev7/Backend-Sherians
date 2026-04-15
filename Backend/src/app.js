console.log("APP.JS LOADED");
const express = require('express');
const noteModel = require("./models/note.model")

//created a server
const app = express();
app.use(express.json()); //express.json is the middleware which convert req.body to json.format 


// const notes = []; //in notes array we will store all the notes which we will get from the client and we will send this notes array to the client when client will hit the GET /notes API
//but in notes array data will get reset every time we restart the server so we are using notemodel i.e connection our express server with database so data doesnt get reset everytime we restart the server
//we are using notemodel i.e connection our express server with database so data doesnt get reset everytime we restart the server

console.log("NOTES ARRAY INITIALIZED");

//post is the method and notes is the API name
app.post("/notes",async (req,res) =>{
    console.log(req.body);
    // notes.push(req.body); //push is used to add the note in the notes array
    //we are using notemodel i.e connection our express server with database so data doesnt get reset everytime we restart the server
    try {
         const note = await noteModel.create(req.body); //create is used to add a note in the database and it returns the created note

        res.status(201).json({
            message:"Note added successfully",
            note
        });
    } 
    catch (error) {
        res.status(500).json({
            message:"Error creating note",
            error: error.message
        });
    }
});


//READ
app.get("/notes",async (req,res) =>{
    console.log("GET ROUTE HIT");
    
    try{
        const notes = await noteModel.find(); //find is used to get all the notes from the database and it returns an array of notes
        console.log(notes);
        res.status(200).json({ //200 denotes The request was successful.

        message:"Notes fetched successfully",
        notes:notes
        });
    }
    catch(err){
        res.status(500).json({
            message:"Error Fetching Notes!!",
            error:err.message
        })
    }
})

//delete is used to delete the data from the server and :index is used to get the index no of the note which we want to delete
app.delete("/notes/:id",async (req,res) =>{
    console.log("DELETE ROUTE HIT");
    // const index = parseInt(req.params.index); //req.params.index gives the index no
    // if(index < 0 || index >= notes.length){
    //     res.status(404).json({
    //         message:"Invalid index..Notes not found"
    //     });
    //     return;
    // }
    // notes.splice(index,1); //splice is used to remove the element from the array
    // console.log(notes);
    // res.status(200).json({ 
    //     //200 denotes The request was successful...
    //     message:"Notes deleted successfully"
    // });
    try{
        const id = req.params.id;
        const deletedNote = await noteModel.findByIdAndDelete(id); //findByIdAndDelete is used to delete the note from the database and it returns the deleted note
        if(!deletedNote){
            res.status(404).json({message:"Note not found"});
            return;
        }
        res.json({message:"Deleted"});
    }catch(error){
        res.status(500).json({message:"Error deleting note",error:error.message});
    }
});

//patch is used to update the data in the server and :id is used to get the id of the note which we want to update
app.patch("/notes/:id",async (req,res) =>{
    // console.log("PATCH ROUTE HIT");
    // //we need to convert req.params.index to integer because req.params.index returns an string
    // const index = parseInt(req.params.index); //req.params.index gives the index no
    // if(index < 0 || index >= notes.length){ 
    //     res.status(404).json({
    //         message:"Invalid index..Notes not found"
    //     });
    //     return;
    // }
    // notes[index] = {...notes[index],...req.body};// Update the note with the new data
    // console.log(notes);
    // res.status(200).json({
    //     message:"Notes updated successfully"
    // });
    try{
        const id = req.params.id;
        const updatedNote = await noteModel.findByIdAndUpdate(id,req.body,{new:true}); //tell mongoose to return the UPDATED document, not the old one”
        if(!updatedNote){
            res.status(404).json({message:"Note not found"});
            return;
        }
        res.json({message:"Updated",note:updatedNote});
    }catch(error){
        res.status(500).json({message:"Error updating note",error:error.message});
    }
});

//exporting the app
module.exports = app;