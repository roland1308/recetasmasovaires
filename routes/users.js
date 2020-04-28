const express = require('express')
const router = express.Router()

const userModel = require('../model/userModel')

// Login user
router.post("/login", (req, res) => {
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

module.exports = router