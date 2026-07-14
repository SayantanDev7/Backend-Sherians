// const http = require("http")

// const server = http.createServer((req,res) =>{ //creating the server
//     if(req.url === "/"){
//         res.end("Hello World");
//     }
//     if(req.url === "/notes"){
//         res.end("Notes API");
//     }
//     if(req.url === "/users"){
//         res.end("Users API");
//     }
// });
// server.listen(3000,() =>{ //starting the server
//     console.log("Server started on port 3000"); //logging the message to the console
// });

//We done use http for creating server because it is very time consuming and there are many things to do
//so we use express for creating server


const express = require('express');

const app = express(); //calling express() is as same as createServer()

//res -> object use to send response to the client
//req -> object use to take request from the client

app.get("/",(req,res)=>{
    res.send("Hello World by express");
})

app.get("/notes",(req,res)=>{
    res.send("Notes API by express");
})

app.get("/users",(req,res)=>{
    res.send("Users API by express");
})

app.listen(3000,() =>{
    console.log("Server started on port 3000");
});


