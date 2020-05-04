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

let input = {
    'to': { 'a.renato@gmail.com': 'to whom!' },
    'from': ['recetasmasovaires@gmail.com', 'Family Recipes'],
    'subject': 'Test mail form V2 codice corto',
    'html': 'This is the <h1>HTML</h1>'
};

// Login user
router.post("/login", (req, res) => {
    input.subject = "New log in from Family Recipes"
    input.html = req.body.name + ' just logged in!'
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
    userModel
        .findOne({
            name: req.body.name
        })
        .then(user => {
            if (!user) {
                console.log("User not found");
                res.send("error");
            } else {
                if (user.password !== req.body.password) {
                    console.log("PW ERRATA");
                    res.send("error")
                } else {
                    //   // create JWT payload, sign token and send it back
                    res.send(user);
                }
                // compare passwords with bycript compare function
                //   bcrypt.compare(req.body.pw, user.pw, function (err, result) {
                // if (!result) {
                //   console.log("PW ERRATA", err);
                //   res.send("PW ERRATA");
                // } else {
                //   // create JWT payload, sign token and send it back
                //   res.send(user);
                // }
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