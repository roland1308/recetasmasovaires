const mongoose = require('mongoose')

const recipeEngSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model('recipeeng', recipeEngSchema)