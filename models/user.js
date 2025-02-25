const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowerCase: true
    },
    username: {
        type: String,
        require: true,
        lowerCase: true
    },
    passWord: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    scoresId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "scores"
    }
},{timestamps: true})

const userModel = mongoose.model('Users', userSchema)

module.exports = userModel