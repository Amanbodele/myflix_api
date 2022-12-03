const mongoose = require("mongoose");

const usermoviesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movies"
    },
    watchtime: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const userMoviesModel = mongoose.model("user_movies", usermoviesSchema);
module.exports = userMoviesModel;