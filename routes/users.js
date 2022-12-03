const express = require("express");
const fs=require("fs")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const userModel = require('../models/users-models');
const userMoviesModel = require("../models/user-movie-model")
const router = express.Router();
const verifyToken = require("./verifyToken");
const movieModel = require("../models/movie-model");

router.post("/", (req, res) => {
    let user = req.body;
    bcryptjs.genSalt(10, (err, salt) => {
        if (err === null || err === undefined) {
            bcryptjs.hash(user.password, salt, (err, encp) => {
                if (err === null || err == undefined) {
                    user.password = encp;
                    userModel.create(user)
                        .then((doc) => {
                            res.send({ message: "user is regestered", success: true });
                            // console.log("user is regestered");
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                else {
                    console.log(err);
                    res.send({ message: "please fill the details correctly" });
                }
            })
        }
        else {
            res.send({ message: "error must is there" });
        }
    })


})


router.post("/login", (req, res) => {
    let userCred = req.body;

    userModel.findOne({ username: userCred.username })
        .then((user) => {

            if (user !== null && user !== undefined) {
                bcryptjs.compare(userCred.password, user.password, (err, result) => {
                    if (err === null || err === undefined) {
                        // console.log(result)
                        if (result === true) {


                            jwt.sign({ username: userCred.username }, "secretkey", (err, token) => {
                                if (err === null || err === undefined) {

                                    res.send({ success: true, token: token, username: user.username, user_id: user._id })
                                }
                            })
                        }
                        else {

                            res.send({ message: "Invalid Password" })
                        }
                    }
                    else {
                        res.send({ message: "error in login " })
                    }
                })
            }
            else {
                res.send({ message: "user not found" });
            }
        })
})

//ENDPOINT TO STORE INFO ABOUT THE MOVIE AND THE USER

router.post("/play", verifyToken, (req, res) => {
    const user_movie = req.body;
    userMoviesModel.findOne({ user: user_movie.user, movie: user_movie.movie })
        .then((watchdata) => {
            if (watchdata === null) {
                userMoviesModel.create(user_movie)
                    .then((data) => {
                        res.send({ message: "play info is created", user_movie:data })
                    })
                    .catch((err) => {
                        res.send({ message: "eroor in fetching a movie " })
                    })
            }
            else {
                res.send({ success: true, message: "play info exist", user_movie:watchdata })
            }
        })
        .catch((err) => {
            res.send({ meaage: "eroor in fetching a movie " })
        })

})

//update the info of watchtiming and all after closing the app

router.put("/closeplayer/:user_movie_id", (req, res) => {
    let user_movie_id = req.params.user_movie_id;
    let datatoupdate = req.body
    userMoviesModel.updateOne({ _id: user_movie_id }, datatoupdate)
        .then((msg) => {
            res.send({ success: true, message: "updation in watched time is done " })
        })
        .catch((err) => {
            res.send({ message: "eroor in fetching a movie ", success: false })
        })
})


///FOR PLAYING VIDEO STREAMING LOGIC
let movie_id = null;
let filePath = null;
router.get("/stream/:id", (req, res) => {
    if (movie_id === null || movie_id !== req.params.id) {
        movie_id = req.params.id;
        let movie = movieModel.findOne({ _id: movie_id });

        if (movie !== null) {
            filePath = movie.filePath
        }

    }
    let movie =  movieModel.findOne({ _id: req.params.id });

    if (movie !== null) {
        filePath = movie.filePath
    }

    const range = req.headers.range
    if (!range) {
        res.send({ mesage: "Range is required" })
    }
    const videoSize = fs.statSync(__dirname+"/"+filePath).size
    // console.log(videoSize)
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + 10 ** 6, videoSize - 1)
    const contentLength = end - start;
    // console.log(start)
    // console.log(end)
    // console.log(contentLength)
    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Content-Type": "video/mp4",
        "Content-Length": contentLength,
        "Accept-Range": "bytes"
    })

    const readStream = fs.createReadStream(__dirname+"/"+filePath, { start, end });
    readStream.on("data", (chunk) => {
        res.write(chunk);
    })

    // readStream.pipe(res)
})


module.exports = router;