const express = require('express')
const router = express.Router()

const recipeModel = require('../model/recipeModel')

const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: "hiulcyz4k", //ENTER YOUR CLOUDINARY NAME
    api_key: process.env.CLOUDINARY_API_KEY, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
    api_secret: process.env.CLOUDINARY_API_SECRET // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
})

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
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
        const result = await cloudinary.uploader.upload(req.file.path, (result) => {
        }, { public_id: req.file.originalname })
        fs.unlinkSync(req.file.path)
        res.send(result.secure_url)
    } catch (error) {
        res.send(error)
    }
});

module.exports = router