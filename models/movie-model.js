const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: String,
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
       
    },
    imdbRating: {
        type: Number,
        required: true,
        
    },
    posterURL: {
        type: String,
        required: true,
        unique: true

    },
    filePath:{
        type:String,
        required:true,
        unique:true
    },
    top:{
        type:Boolean,
        default:false
    },
    watchers:{
        type:Number,
        default:0 
    }

}, { timestamps: true })

const movieModel = mongoose.model("movies", movieSchema);

module.exports=movieModel;

