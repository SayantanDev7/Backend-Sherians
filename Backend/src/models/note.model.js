const mongoose = require('mongoose');

//format to create schemas
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    age:{
        type:Number,
        require:true
    },
    dob: {
        type: Date
    }
});

module.exports = mongoose.model('Note', noteSchema);