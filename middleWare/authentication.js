const userModel = require('../models/user');
const jwt = require('jsonwebtoken')

 exports.authenticate = async (req, res) =>{
    try {
        // get the token from the authorization headers

        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(404).json({
                message: 'token not found'
            })
        }     
        // make sure the token is a valid jwt token 
        const token = auth.split(' ')[1];
        if (!token ) {
            return res.status(400).json({
                message: 'invalid token'
            })
        }

        // verify the token to make sure it is still valid

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        // check if the user still existing
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(400).json({
                message: 'Authentocation failed: user not found'
            })
        }
        // pass the payload to the request user object
        req.user = decodedToken;
        // call the next function
        next();

    } catch (error) {
        console.log(error.message);  
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'session time-out, please loin to continue'
            })
        }      
        res.status(500).json({
            message: 'internal server error'
        })
    }
 };

 exports.authenticationAdmin = async (req, res) =>{
    try {
        // get the token from the authorization headers
        const auth = req.headers.authorization
        // make sure the token is a valid jwt token
        const token = auth.split(' ')[1];
        if (!token) {
            return res.status(400).json({
                message: 'invalid token'
            })
        }
        // verify the token to be sure it is still valid

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        //  check if the user is still existing
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Authentication failed: User not found'
            })
        }
        if (user.isAdmin === false) {
            return res.status(401).json({
                message: 'unauthorized: youre not allow to perform the folloeing action'

            })
        }
        // pass the pauload th the request user object
        req.user = decodedToken;
        // call the next function
        next();

    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'session time-out, please login to countinue'
            })
        }
        res.status(500).json({
            message: 'internal server error'
        })
    }
 }