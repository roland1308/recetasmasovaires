const express = require('express')
const router = express.Router()

const recipeModel = require('../model/recipeModel')

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs')
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString();
        //windows needs to replace ":" for "-" to save the picture correctly
        const date = now.replace(/:/g, "-");
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
    console.log("Ricetta aggiunta");
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
    try {
        cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
            .then(result => {
                fs.unlinkSync(req.file.path)
                return res.send(result.secure_url)
            })
        // .exec((err) => {
        //     if (err) { return res.send(err); }
        // })
    }
    catch (error) {
        return res.send("errore")
        console.log(error);
    }
});

module.exports = router