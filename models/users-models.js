const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
        minLength: 10,
        maxLength: 10,
    },
    city:{
        type: String,
        required: true,
        
    }
  
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema);

module.exports=userModel;

