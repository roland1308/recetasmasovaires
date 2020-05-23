const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    chef: {
        type: String
    },
    type: {
        type: String
    },
    ingredients: {
        type: Array
    },
    preparation: {
        type: String
    },
    pictures: {
        type: Array
    },
    pax: {
        type: Number
    },
    likes: {
        type: Array
    },
    avatarimg: {
        type: String
    }
})

module.exports = mongoose.model('recipe', recipeSchema)