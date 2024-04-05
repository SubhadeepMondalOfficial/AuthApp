//require @jsonwebtoken npm package
const jwt = require('jsonwebtoken');
require('dotenv').config();

//!================ auth middleware ================== 

exports.auth = async (req, res, next) => {
    try {
        //extract token which save in browser from request body
        const token = req.body.token;
        //          OR
        // const token = req.cookie.token

        //If token is not available in req body
        if(!token){
            return res.status(402).json({
                success: false,
                message: "Token missing in request body"
            })
        }

        //If token is available in req body then verify the JWT token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log('decode-', decode);

            req.user = decode
            console.log(req.user);
            
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        //* call next function to transfer to next middleware
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}

//!================= isStudent middleware ==================
exports.isStudent = (req, res, next) => {
    try {
        if(req.user.role !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for students, you not having access'
            })
        }

        next()
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}

//!================= isAdmin middleware ==================
exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admins, you not having access'
            })
        }

        next()
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}
