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

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

const IMAGE_TYPES = ['image/jpeg', 'image/png']
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
    const { name, password, database, language, book, avatarImg } = req.body;
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
            avatarimg: avatarImg
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

/*update a user*/
router.post('/update', passport.authenticate("jwt", { session: false }), (req, res) => {
    const { chef, _id, avatarImg } = req.body
    input.subject = chef + ' just updated his/her profile.'
    input.html = chef + ' just updated his/her profile.'
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
    userModel.findOneAndUpdate(
        { _id },
        {
            $set: {
                avatarimg: avatarImg
            }
        },
        { new: true }
    ).then(old => {
        if (old !== null) {
            res.json(old);
            console.log("Profile updated");
        } else {
            console.log("UPDATE ERROR");
            res.json(old);
        }
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
        avatarimg: req.body.avatarimg,
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

/*add Avatar to uploads folder and to Cloudinary*/
router.post("/addavatar", upload.single("picture"), async (req, res) => {
    const type = req.file.mimetype;
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.send({ error: 'Only jpeg, jpg, jpe, o png are allowed' });
    } else {
        const { filename: image } = req.file
        const resizedLink = req.file.destination + "/" + image
        new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(resizedLink, { public_id: req.file.originalname }, (err, result) => {
                if (err) {
                    return res.send("err")
                }
                return res.send(result.secure_url)
            })
        })
    }
});

module.exports = router