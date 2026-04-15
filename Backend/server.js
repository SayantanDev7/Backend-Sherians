
const app = require("./src/app");

app.get("/",(req,res) =>{
    res.send("Hello World!!");
})

app.get("/about",(req,res) =>{
    res.send("About page!!");
})

app.listen(4000, () => {
    console.log("server is running on port 4000");
});

//started the server