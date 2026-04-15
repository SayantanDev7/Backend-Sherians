const express = require('express');

//created a server
const app = express();

app.post('/note',(req,res) =>{
    console.log(req.body);
})

//exporting the app
module.exports = app;