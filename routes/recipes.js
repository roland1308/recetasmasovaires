const express = require('express')
const router = express.Router()

const recipeModel = require('../model/recipeModel')

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

/*get all recipes*/
router.get('/all',
    (req, res) => {
        recipeModel.find({})
            .then(files => {
                res.send(files)
            })
            .catch(err => console.log(err));
    });

/*add new recipe*/
router.post('/add', (req, res) => {
    const { name, chef, type, ingredients, preparation, pictures } = req.body
    const newRecipe = new recipeModel({
        name,
        chef,
        type,
        ingredients,
        preparation,
        pictures
    });
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

/*add photo to uploads folder*/
router.post("/addphoto", upload.single("picture"), async (req, res) => {
    const type = req.file.mimetype;
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.send({ error: 'La foto tiene que ser jpeg, jpg, jpe, o png' });
    } else {
        const { filename: image } = req.file
        await sharp(req.file.path)
            .resize(600)
            .jpeg({ quality: 100 })
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )
        const resizedLink = req.file.destination + "/resized/" + image
        new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(resizedLink, { public_id: req.file.originalname }, (err, result) => {
                if (err) {
                    return res.send("err")
                }
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(resizedLink)
                return res.send(result.secure_url)
            })
        })
    }
});

module.exports = router