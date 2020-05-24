const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const recipeSchema = new mongoose.Schema({
    name: {
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
    chefid: [{
        type: Schema.Types.ObjectId, ref: 'user'
    }]
})

module.exports = mongoose.model('recipeeng', recipeSchema)