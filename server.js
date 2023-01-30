const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

const bodyParser = require("body-parser");

require("dotenv").config();
const db = process.env.mongoURI;

const passport = require("passport");

//passport middleware
app.use(passport.initialize());
//passport configuration
require("./config/passport");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false)
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log("Connection to Mongo DB established"))
    .catch(err => console.log(err));
app.use("./uploads", express.static("uploads"));

// app.use(cors())
app.use(
    bodyParser.json({
        extended: true
    })
);
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// Initialize CORS middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use('/recipes', require('./routes/recipes'))
app.use('/recipeitas', require('./routes/recipeitas'))
app.use('/recipeengs', require('./routes/recipeengs'))
app.use('/recipecats', require('./routes/recipecats'))
app.use('/users', require('./routes/users'))

// Serve static assets if we are in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("./client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
    });
}

app.listen(port, () => {
    console.log("Server is running on " + port + "port");
});
