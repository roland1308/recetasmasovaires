const express = require('express')
const router = express.Router()

const recipeModel = require('../model/recipeEngModel')

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

/*get all recipes*/
router.get('/all',
    (req, res) => {
        recipeModel.find({}, null, { sort: { _id: -1 } })
            .populate('chefid', 'name avatarimg')
            .then(files => {
                res.send(files)
            })
            .catch(err => console.log(err));
    });

/*add new recipe*/
router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    const { name, chef, type, ingredients, pax, preparation, pictures } = req.body
    const newRecipe = new recipeModel({
        name,
        type,
        ingredients,
        pax,
        preparation,
        pictures,
        chefid
    });
    input.subject = chef + ' just added the recipe: ' + name + " in Family Recipes English"
    input.html = chef + ' just added the recipe: ' + name
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
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
router.post('/update', passport.authenticate("jwt", { session: false }), (req, res) => {
    const { _id, name, chef, type, ingredients, pax, preparation, pictures, removingImg } = req.body
    input.subject = chef + ' just updated the recipe: ' + name + " in Family Recipes English"
    input.html = chef + ' just updated the recipe: ' + name
    sendinObj.send_email(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
    recipeModel.findOneAndUpdate(
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

module.exports = router