const express = require('express')
const router = express.Router()

const recipeModel = require('../model/recipeModel')

const passport = require("passport");

const IMAGE_TYPES = ['image/jpeg', 'image/png']
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
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

const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.sendinblue;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
sendSmtpEmail.subject = "Test mail form V3";
sendSmtpEmail.htmlContent = "This is the <h1>HTML</h1>";
sendSmtpEmail.sender = {"name":"Family Recipes","email":"recetasmasovaires@gmail.com"};
sendSmtpEmail.to = [{"email":"a.renato@gmail.com","name":"Renato"}];

/* const sendinblue = require('sendinblue-api');
const parameters = { "apiKey": process.env.sendinblue, "timeout": 5000 };
const sendinObj = new sendinblue(parameters);
 */
/* let input = {
    'to': { 'a.renato@gmail.com': 'to whom!' },
    'from': ['recetasmasovaires@gmail.com', 'Family Recipes'],
    'subject': 'Test mail form V2 codice corto',
    'html': 'This is the <h1>HTML</h1>'
};
 */
/*get all recipes*/
router.get('/all',
    (req, res) => {
        // removeOldFiles("./uploads/resized")
        // removeOldFiles("./uploads")
        recipeModel.find({}, null, { sort: { _id: -1 } })
            .populate('chefid', 'name avatarimg')
            .then(files => {
                res.send(files)
            })
            .catch(err => console.log(err));
    });

/*add new recipe*/
router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    const { name, type, ingredients, pax, preparation, pictures, chef, chefid } = req.body
    const newRecipe = new recipeModel({
        name,
        type,
        ingredients,
        pax,
        preparation,
        pictures,
        chefid
    });

    sendSmtpEmail.subject = chef + ' just added the recipe: ' + name + " in Family Recipes Spanish";
    sendSmtpEmail.htmlContent = chef + ' just added the recipe: ' + name + " in Family Recipes Spanish";
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
        console.error(error);
    });


/*     input.subject = chef + ' just added the recipe: ' + name + " in Family Recipes Spanish"
    input.html = chef + ' just added the recipe: ' + name
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
 */ 
   newRecipe
        .save()
        .then(recipe => {
            res.send(recipe);
        })
        .catch(err => {
            console.log("ERRORE");
            res.status(500).send(err);
        });
})

/*update a recipe*/
router.post('/update', passport.authenticate("jwt", { session: false }), (req, res) => {
    const { _id, name, type, ingredients, pax, preparation, pictures, removingImg, chef, chefid } = req.body

    sendSmtpEmail.subject = chef + ' just updated the recipe: ' + name + " in Family Recipes Spanish";
    sendSmtpEmail.htmlContent = chef + ' just updated the recipe: ' + name + " in Family Recipes Spanish";
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
        console.error(error);
    });

    /*     input.subject = chef + ' just updated the recipe: ' + name + " in Family Recipes Spanish"
    input.html = chef + ' just updated the recipe: ' + name
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
 */    recipeModel.findOneAndUpdate(
        { _id },
        {
            $set: {
                name,
                type,
                ingredients,
                pax,
                preparation,
                pictures,
                chefid
            }
        },
        { new: true }
    ).then(old => {
        if (old !== null) {
            for (img of removingImg) {
                let destroyImg = img.substr(62, (img.length) - 66)
                cloudinary.v2.uploader.destroy(destroyImg, (err, result) => {
                    if (err) {
                        return res.send("err")
                    }
                })
            }
            res.json(old);
            console.log("Receipt updated");
        } else {
            console.log("UPDATE ERROR");
            res.json(old);
        }
    });
});

/*remove a picture from a recipe*/
router.delete('/delete', passport.authenticate("jwt", { session: false }), (req, res) => {
    const { _id } = req.body
    recipeModel.findOneAndDelete({ _id }).then(result => {
        if (result) {
            console.log("Successful deletion");
            res.send(result);
        } else {
            console.log("NON TROVATA");
            res.send(result);
        }
    });
});

/*add photo to uploads folder and to Cloudinary*/
router.post("/addphoto", upload.single("picture"), async (req, res) => {
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

// PUSH user inside recipe's likes
router.put(
    "/pushlike",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        recipeModel.findByIdAndUpdate(
            req.body._id,
            {
                $push: { likes: req.body.chefId },
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

// PULL user inside recipe's likes
router.put(
    "/pulllike",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        recipeModel.findByIdAndUpdate(
            req.body._id,
            {
                $pull: { likes: req.body.chefId },
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

// router.post("/clear", (req, res) => {
//     removeOldFiles(req.body.directory)
//     res.send("ok")
// })

// removeOldFiles = directory => {
//     fs.readdir(directory, { withFileTypes: true }, (err, files) => {
//         if (err) throw err;
//         for (const file of files) {
//             if (file.isDirectory() !== true) {
//                 fs.unlink(path.join(directory, file.name), err => {
//                     if (err) throw err;
//                 });
//             }
//         }
//     });
// }

module.exports = router