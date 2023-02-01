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

/* const sendinblue = require('sendinblue-api');
const parameters = { "apiKey": process.env.sendinblue, "timeout": 5000 };
const sendinObj = new sendinblue(parameters);
 */

const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.sendinblue;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

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
const path = require('path')
const sharp = require('sharp')

sendSmtpEmail.subject = "Test mail form V3";
sendSmtpEmail.htmlContent = "This is the <h1>HTML</h1>";
sendSmtpEmail.sender = {"name":"Family Recipes","email":"recetasmasovaires@gmail.com"};
sendSmtpEmail.to = [{"email":"a.renato@gmail.com","name":"Renato"}];

/* let input = {
    'to': { 'a.renato@gmail.com': 'to whom!' },
    'from': ['recetasmasovaires@gmail.com', 'Family Recipes'],
    'subject': 'Test mail form V2 codice corto',
    'html': 'This is the <h1>HTML</h1>'
};
 */

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
    const { name, password, database, language, book, avatarImg, email } = req.body;
    if (!name || !password || !database || !language || !book) {
        return res.status(400).json({ msg: "Please fill all required fields" });
    }
    bcrypt.hash(password, saltRounds).then(function (hash) {
        const newUser = new userModel({
            name,
            database,
            language,
            book,
            password: hash,
            avatarimg: avatarImg,
            email: email
        });
        newUser
            .save()
            .then(user => {

                sendSmtpEmail.subject = name + ' just registered!';
                sendSmtpEmail.htmlContent = name + ' just registered!';
                apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                }, function (error) {
                    console.error(error);
                });
                

/*                 input.subject = name + ' just registered!'
                input.html = name + ' just registered!'
                sendinObj.send_email(input, function (err, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(response);
                    }
                });
 */   
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
    const { chef, _id, avatarImg, email } = req.body

    sendSmtpEmail.subject = chef + ' just updated his/her profile!';
    sendSmtpEmail.htmlContent = chef + ' just updated his/her profile!';
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
        console.error(error);
    });

/*     input.subject = chef + ' just updated his/her profile.'
    input.html = chef + ' just updated his/her profile.'
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
 */ 
   userModel.findOneAndUpdate(
        { _id },
        {
            $set: {
                avatarimg: avatarImg,
                email
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

sendSmtpEmail.subject = name + ' just logged in!';
sendSmtpEmail.htmlContent = name + ' just logged in!';

apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function (error) {
    console.error(error);
});

/*    
 input.subject = name + ' just logged in!'
    input.html = name + ' just logged in!'
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
 */ 
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
router.put("/pullfav", passport.authenticate("jwt", { session: false }), (req, res) => {
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
});

/*add Avatar to uploads folder and to Cloudinary*/
router.post("/addavatar", upload.single("picture"), async (req, res) => {
    const type = req.file.mimetype;
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.send({ error: 'Only jpeg, jpg, jpe, o png are allowed' });
    } else {
        const { filename: image } = req.file
        await sharp(req.file.path)
            .resize(300, 200, { fit: "cover" })
            .jpeg({ quality: 80 })
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )
        const resizedLink = req.file.destination + "/resized/" + image
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

router.post("/sendemail", (req, res) => {
    const { from, to, subject, html } = req.body;
    bcrypt.hash(to, saltRounds).then(function (hash) {

        sendSmtpEmail.sender = {"name":"Family Recipes","email": from};
        sendSmtpEmail.to = [{"email": to,"name": "to whom!"}];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html + "<h2>" + hash + "</h2>";
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            return res.send(true);
        }, function (error) {
            console.error(error);
            return res.send(false);
        });


        /* let inputEmail = {
            'from': [from, 'Family Recipes'],
            'to': { [to]: 'to whom!' },
            'subject': subject,
            'html': html + "<h2>" + hash + "</h2>"
        };
        sendinObj.send_email(inputEmail, function (err, response) {
            if (err) {
                console.log(err);
            }
            return res.send(response)
        }) */
    })
})

router.post("/sendrecipe", (req, res) => {

    sendSmtpEmail.sender = req.body.from
    sendSmtpEmail.to = req.body.to
    sendSmtpEmail.subject = req.body.subject;
    sendSmtpEmail.htmlContent = req.body.html;
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return res.send(true);
    }, function (error) {
        console.error(error);
        return res.send(false);
    });

/*     sendinObj.send_email(req.body, function (err, response) {
        if (err) {
            console.log(err);
        }
        return res.send(response)
    })
 */})

router.post("/checkcode", (req, res) => {
    const { to, veriCode } = req.body;
    bcrypt.compare(to, veriCode, function (err, result) {
        if (!result) {
            res.send("error")
        } else {
            res.send("verified");
        }
    })
})

module.exports = router