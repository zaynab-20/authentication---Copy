const joi = require("joi")

exports.registerSchema = joi.
object().keys({
    fullName: joi.string().trim().min(3).max(20).required(),
    email: joi.string().trim().email().required(),
    passWord: joi.string().trim().required(),
    gender: joi.string().trim().valid('Male', 'Female').required(),
    username: joi.string().trim().required()
})

exports.loginSchema = joi.object().keys({
    email: joi.string().trim().min(6).max(50).email().required(),
    password: joi.string().trim().min(6).max(8).required()
})