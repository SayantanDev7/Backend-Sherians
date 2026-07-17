//how the server will be connected with database that logic is written here

const mongoose = require("mongoose");

function connectToDb(){
    //mongoose.connect() -> returns a promise
    //we are returning this promise so that we can use it in server.js file
    mongoose.connect("mongodb+srv://sayantanemail32005_db_user:ZYyqPWN4VAAFZZY2@cluster0.rfgkg1o.mongodb.net/sheryiansdb")
    .then(() =>{
        console.log("connected to DB successfully")
    })
    .catch((err) =>{
    console.log("Error while connecting to DB");
    console.log(err);
})

}

module.exports = connectToDb;