import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username:{type:String,
        required:true,
        trim:true
    },
    email:{type:String,
        required:true,
        trim:true
    },
    password:{type:String,
        required:true,
        trim:true
    }
})

const authModel = mongoose.model("authModel",authSchema);
export default authModel;