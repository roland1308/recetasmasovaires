const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    database: {
        type: String
    },
    language: {
        type: String
    },
    password: {
        type: String
    },
    book: {
        type: String
    }
})

module.exports = mongoose.model('user', userSchema)