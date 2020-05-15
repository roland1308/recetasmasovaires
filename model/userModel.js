const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    database: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    book: {
        type: String,
        required: true,
    },
    favorites: {
        type: Array
    }
})

module.exports = mongoose.model('user', userSchema)