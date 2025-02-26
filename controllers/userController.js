const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const sendEmail = require('../middleWare/nodemailer');
const jwt = require('jsonwebtoken');
const signUpTemplate = require('../utils/mailTemplate');

exports.register = async (req, res) =>{
    try {
        // extract the required field from the request body
        const { fullName, gender,email, passWord, username} = req.body;
        
        const user = await userModel.findOne({ email: email.toLowerCase () });
        if (user) {
            return res.status(400).json({
                message: `user with email: ${email} already exists `
            })
        }
        const usernameExists = await userModel.findOne({username: username.toLowerCase()})
        if (usernameExists) {
            return res.status(400).json({
                message: `username has already been taken`
            })
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passWord, salt);
        const newUser = new userModel ({
            fullName, 
            email, 
            gender,
            username,
            passWord: hashedPassword

        })

        const token = await jwt.sign({userId: newUser._id},
            process.env.JWT_SECRET, { expiresIn: '10mins'}
        )
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newUser.fullName.split(' ')[0]

        const mailDetails = {
            email: newUser.email,
            subject: 'Welcome Email',
            html: signUpTemplate(link, firstName)

        }

        await sendEmail(mailDetails)

        await newUser.save()

        res.status(201).json({
            message: 'user created successfully',
            data: newUser
                })
        
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            message: 'error registering user'
        })
    }
};


exports.verifyEmail = async  (req, res) =>{
    try {
        const {token} = req.params

        if (!token) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedToken.userId)

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
                })
        }
        if (user.isVerified ===  true) {
            return res.status(400).json({
                message: 'user has already been verified'
            })
        }
    } catch (error) {
           console.log(error.message);
           if (error instanceof jwt.JsonWebTokenError) {
            res.status(500).json({
                message: 'error verifying email'
            })
           }
        
    }
}


exports.resendVerificationEmail =  async (req, res) => {
    try {
        const {email} = req.body

        if (!email) {
            return res.status(400).json({
                message: 'please enter email address'
            })
        }

        const user = await userModel.findOne({email: email.toLowerCase()})

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        const token = await jwt.sign({userId: user_id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        const link = `${req.protocol}`

        const firstName = user.fullName.split('')[1]

        const mailOptions = {
            subject: 'email verification',
            email: user.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({
            message: 'verification email sent, please check mail box'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'error resending verification email' + error.message
        })
    }
};

exports.login = async (req, res) =>{
    try {
        const {email,username, passWord} = req.body;

        if (!email && !username) {
            return res.status(404).json({
                message: 'please enter either email or username'
            });
        }
        if (!passWord) {
            return res.status(404).json({
                message: 'please enter your password'
            });
        }

        const user = await userModel.findOne({$or:[{email}, {username: username.toLowerCase()}]});

        if (user === null) {
            return res.status(404).json({
                message: 'user not found'
            });
        };
        const isCorrectPassword = await bcrypt.compare(passWord, user.passWord)

        if (isCorrectPassword === false) {
            return res.status(400).json({
                message: 'incorrect password'
            });
        };

        if (user.isVerified === false) {
            return res.status(400).json({
                message: 'user not verified, please check your email for verification link'
            })
        }

        const token = await jwt.sign({userId: user_id}, process.env.JWT_SECRET, {expiresIn: '15mins'})

        res.status(200).json({
            message: 'login successful',
            data: user,
            token
        })
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            message: 'internal server error'
        })
    }
};

exports.forgotPassword = async (req, res) =>{
    try {
        const {email} = req.params;

        if (!email) {
            return res.status(100).json({
                message: 'please input your email'
            })
        }

        const user = await userModel.findOne({
            email: email.toLowerCase()
        });
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        // generate token for the user

        const token = await jwt.sign({userId: user_id}, process.env.JWT_SECRET, {expiresIn: '10mins'});
        //  create the reset link

        const link = `${req.protocol}://${req.get(host)}/api/v1/initiate/recover/${token}`
        const firstName = user.fullName.split(' ')[0];

        //  configure the email details

        const mailOptions = {
            subject: 'password Reset',
            email: user.email,
            html: forgotTemplate(link, firstName)
        }
        //  await nodemailer to send the user  an email

        await sendEmail(mailOptions)

        // send a success response
        res.status(200).json({
            message: 'password reset initiated, please check your email for the reset link'
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error '
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        // extract the token from  the params
        const {token} = req.params
        //  extract the password and confirm password for the reset body

        const {userId} = await jwt.verify(token, process.env.JWT_SECRET);
        // check if the user is still existing
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        // confirm that the password matches
        if (passWord !== confirmPassword) {
            return res.status(400).json({
                message: 'password does not match'
            })
        }
        // generate a salt and hash the password
        const salt = await bcrypt.hash.genSalt(10)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
}


exports.changePassword = async (req, res) =>{
    try {
        const {oldPassword, newPassword, confirmPassword} = req.body;
        const {userId} = req.params

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const correctPassword = await bcrypt.compare(oldPassword, user.passWord)
        if (!correctPassword) {
            return res.status(400).json({
                message: 'enter your correct password'
            })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'passwod does not match'
            })
        }
        const salt = await bcrypt.hash(newPassword, salt)

        user.passWord = hashedPassword

        await user.save()

        res.status(200).json({
            message: 'password changed successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

exports.isAdmin = async (req, res) =>{
    try {
        const {id} = req.params
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        user.isAdmin = true
        if (!req.user.isAdmin) {
            return res.status(403).json({
                message: 'you are not authorized to make this change'

            })
        }

        res.status(200).json({
            message: `user are now an admin`
        })
    } catch (error) {
        console.log(error.message)        
        res.status(500).json({
            message: 'internal server error'
        })
    }
}
