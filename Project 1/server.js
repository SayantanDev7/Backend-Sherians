const app = require("./src/app")
const connectDB = require("./src/db/db")

connectDB();

app.get("/",(req,res) =>{
    res.send("Hello World!");
})
app.listen(4500,() =>{
    console.log("Server is running on port 4500");
})