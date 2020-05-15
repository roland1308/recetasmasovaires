const express = require('express')
const router = express.Router()

require("dotenv").config();
const secretOrKey = process.env.secretOrKey;
const bookCodes = process.env.bookCodes.split(',');

const bookList = ["Recetas de los Masovaires", "Ricette degli amici", "Recipes' book", "Llibre de receptes"]
const bookDBs = ["/recipes/", "/recipeitas/", "/recipeengs/", "/recipecats/"]
const languageList = ["Español", "Italiano", "English", "Català"]

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

/*check book code*/
router.get("/book/:bookCode", (req, res) => {
    const index = bookCodes.findIndex(x => x === req.params.bookCode)
    let response = {}
    if (index !== -1) {
        response = {
            status: true,
            book: bookList[index],
            database: bookDBs[index],
            language: languageList[index]
        }
    } else {
        response = {
            status: false,
            book: undefined,
            database: undefined,
            language: undefined
        }
    }
    res.json(response)
})

/*add a User if not existing already: CREATE*/
router.post("/add", async (req, res) => {
    const { name, password, database, language, book } = req.body;
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
                input.subject = name + ' just registered!'
                input.html = name + ' just registered!'
                sendinObj.send_email(input, function (err, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(response);
                    }
                });
                res.send(user);
            })
            .catch(err => {
                console.log(err)
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
                bcrypt.compare(password, user.password, function (err, result) {
                    if (!result) {
                        console.log("password ERRATA");
                        res.send("error")
                    } else {
                        res.send(user);
                    }
                })
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

// PUSH recipe inside user's favorites
router.put(
    "/pushfav",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userModel.findByIdAndUpdate(
            req.body.chefId,
            {
                $push: { favorites: req.body._id },
            },
            { multi: true },
            function (err, doc) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("OK");
                }
            }
        )
    }
);

// PULL recipe inside user's favorites
router.put(
    "/pullfav",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userModel.findByIdAndUpdate(
            req.body.chefId,
            {
                $pull: { favorites: req.body._id },
            },
            { multi: true },
            function (err, doc) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("OK");
                }
            }
        );
    }
);

module.exports = router