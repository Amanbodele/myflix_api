const express=require("express");
const fs=require("fs")
const movieModel=require('../models/movie-model');
const router=express.Router();
const verifyToken=require("../routes/verifyToken")

router.post("/",verifyToken, (req, res) => {
    movieModel.create(req.body)
    .then((doc) => {
        res.send(doc);
        console.log("movie is created");
    })
    .catch((err)=>{
        console.error(err);
    })
})

router.get("/",(req,res)=>{
    movieModel.find()
    .then((movies)=>{
        res.send(movies);
    })
    .catch((err)=>{
        console.error(err);
    })
})

router.get("/:id",(req,res)=>{
    let movieId=req.params.id;
    movieModel.findOne({_id:movieId})
    .then((movie)=>{
        res.send(movie);
    })
    .catch((err)=>{
        console.error(err);
    })
})

let movie_id = null;
let filePath = null;
router.get("/stream/:id",async (req, res) => {
    if (movie_id === null || movie_id !== req.params.id) {
        movie_id = req.params.id;
        let movie = await movieModel.findOne({ _id: movie_id });

        if (movie !== null) {
            filePath = movie.filePath
        }

        // console.log(movie , "movie");
        // console.log(filePath);
    }
   
    const range = req.headers.range
    if (!range) {
        res.send({ mesage: "Range is required" })
    }
    const videoSize = fs.statSync("./"+filePath).size;
    // console.log(videoSize , "size")
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

    const readStream = fs.createReadStream("./"+filePath, { start, end });
    readStream.on("data", (chunk) => {
        res.write(chunk);
    })

    // readStream.pipe(res)
})


module.exports=router;