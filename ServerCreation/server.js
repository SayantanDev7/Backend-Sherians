const http = require("http")

const server = http.createServer((req,res) =>{ //creating the server
    if(req.url === "/"){
        res.end("Hello World");
    }
    if(req.url === "/notes"){
        res.end("Notes API");
    }
    if(req.url === "/users"){
        res.end("Users API");
    }
});
server.listen(3000,() =>{ //starting the server
    console.log("Server started on port 3000"); //logging the message to the console
});