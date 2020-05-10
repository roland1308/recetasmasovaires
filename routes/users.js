const express = require('express')
const router = express.Router()

require("dotenv").config();
const secretOrKey = process.env.secretOrKey;

const userModel = require('../model/userModel')
const jwt = require("jsonwebtoken");
const passport = require("passport");

const sendinblue = require('sendinblue-api');
const parameters = { "apiKey": process.env.sendinblue, "timeout": 5000 };
const sendinObj = new sendinblue(parameters);

const bcrypt = require("bcrypt");
const saltRounds = 10;

let input = {
    'to': { 'a.renato@gmail.com': 'to whom!' },
    'from': ['recetasmasovaires@gmail.com', 'Family Recipes'],
    'subject': 'Test mail form V2 codice corto',
    'html': 'This is the <h1>HTML</h1>'
};

/*add a User if not existing already: CREATE*/
router.post("/add", async (req, res) => {
    const { name, password, database, language, book } = req.body;
    input.subject = name + ' just registered!'
    input.html = name + ' just registered!'
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
    if (!name || !password || !database || !language || !book) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    bcrypt.hash(password, saltRounds).then(function (hash) {
        const newUser = new userModel({
            name,
            database,
            language,
            book,
            password: hash,
        });
        newUser
            .save()
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.send(err);
            });
    });
});

// Login user
router.post("/login", (req, res) => {
    const { name, password } = req.body;
    input.subject = name + ' just logged in!'
    input.html = name + ' just logged in!'
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
    userModel
        .findOne({
            name
        })
        .then(user => {
            if (!user) {
                console.log("User not found");
                res.send("error");
            } else {
                // bcrypt.compare(password, user.password, function (err, result) {
                //     if (!result) {
                //         console.log("password ERRATA");
                //         res.send("error")
                //     } else {
                res.send(user);
                // }
                // })
            }
        });
});

//Create TOKEN
router.post("/token", (req, res) => {
    const payload = {
        _id: req.body._id,
        name: req.body.name,
        database: req.body.database,
        language: req.body.language,
        password: req.body.password,
        book: req.body.book,
    };
    const options = { expiresIn: 86400 };
    const token = jwt.sign(payload, secretOrKey, options);
    res.send(token);
});

// JWT TOKEN Translation
router.get(
    "/check",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json(req.user);
    }
);

module.exports = router