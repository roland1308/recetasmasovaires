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
        removeOldFiles("./uploads/resized")
        removeOldFiles("./uploads")
        recipeModel.find({})
            .then(files => {
                res.send(files)
            })
            .catch(err => console.log(err));
    });

/*add new recipe*/
router.post('/add', (req, res) => {
    const { name, chef, type, ingredients, pax, preparation, pictures } = req.body
    const newRecipe = new recipeModel({
        name,
        chef,
        type,
        ingredients,
        pax,
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

/*update a recipe*/
router.post('/update', (req, res) => {
    const { _id, name, chef, type, ingredients, pax, preparation, pictures, removingImg } = req.body
    recipeModel.findOneAndUpdate(
        { _id },
        {
            $set: {
                name,
                chef,
                type,
                ingredients,
                pax,
                preparation,
                pictures
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
router.delete('/delete', (req, res) => {
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

/*add photo to uploads folder*/
router.post("/addphoto", upload.single("picture"), async (req, res) => {
    const type = req.file.mimetype;
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.send({ error: 'La foto tiene que ser jpeg, jpg, jpe, o png' });
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

// router.post("/clear", (req, res) => {
//     removeOldFiles(req.body.directory)
//     res.send("ok")
// })

removeOldFiles = directory => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if (file.isDirectory() !== true) {
                fs.unlink(path.join(directory, file.name), err => {
                    if (err) throw err;
                });
            }
        }
    });
}

module.exports = router