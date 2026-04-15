const express = require('express');

//created a server
const app = express();
app.use(express.json()); //express.json is the middleware which convert req.body to json.format 

app.post('/note',(req,res) =>{
    console.log(req.body);
})

const notes = [];

//post is the method and notes is the API name
app.post("/notes",(req,res) =>{
    console.log(req.body);
    notes.push(req.body);

    res.status(201).json({ //201 denotes resources added successfully
        message:"Note added successfully",
        note:req.body
    })
})

app.get("/notes",(req,res) =>{
    res.status(200).json({ //200 denotes The request was successful.

        message:"Notes fetched successfully",
        notes:notes
    });
})

//exporting the app
module.exports = app;