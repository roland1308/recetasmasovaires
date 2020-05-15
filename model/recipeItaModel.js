const mongoose = require('mongoose')

const recipeItaSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('recipeita', recipeItaSchema)