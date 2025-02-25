
const router = require('express').Router()

const { login, register, verifyEmail, resendVerificationEmail } = require('../controllers/userController')


router.post('/user', register)

router.post('/login',login)

router.get('/user-verify/:token', verifyEmail)

router.post('/resend-verification/', resendVerificationEmail)

module.exports = router