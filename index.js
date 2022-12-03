require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const movieRouter = require("./routes/movies")
const userRouter = require("./routes/users")

const cors = require("cors");
const port = process.env.PORT || 8000

const app = express();
app.use(express.json());   //...........this is used to manupulate data in the body by just req.body

app.use(cors(
    {
        origin: "*",
    }
));
//connection to mongodb server

mongoose.connect("mongodb+srv://amanbodele:Aman123@cluster0.fx54iua.mongodb.net/movies", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("connection is done ");
    }).catch((err) => {
        console.log(err);
    })

app.get('/', (req, res) => {
    res.send('<h1>API for MovieFlix</h1>');
});

app.use("/movies", movieRouter);
app.use("/users", userRouter);

app.listen(port, () => {
    console.log("server is up and running");
})