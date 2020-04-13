const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require("body-parser");

require("dotenv").config();
const db = process.env.mongoURI;

const mongoose = require("mongoose");
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log("Connection to Mongo DB established"))
    .catch(err => console.log(err));
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use('/recipes', require('./routes/recipes'))

app.listen(port, () => {
    console.log("Server is running on " + port + "port");
});