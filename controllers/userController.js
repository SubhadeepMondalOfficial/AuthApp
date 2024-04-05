const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

//require @jsonwebtoken npm package
const jwt = require('jsonwebtoken');

require('dotenv').config();

//!================= Sign-Up router handler =================
exports.signup = async (req, res) => {
  try {
    // extract data from request's body
    const { name, email, password, role } = req.body;

    //* check if the user already exist using email
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    //* Secure the password
    let hashPassword;
    try {
      const saltRound = 10;
      hashPassword = await bcrypt.hash(password, saltRound);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    //* Create Entry of User in DB
    const userDetails = await userModel.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User Entry Created Successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to Create New User",
      errorMessage: error.message,
    });
  }
};


//!================= Login router handler =================
exports.login = async (req, res) => {
    try {
    //* extract data from request's body
    const {email, password} = req.body;

    //* Check whether the email and password filled or empty
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: 'Please fill all the details carefully'
        });
    }

    //* Check wheather the user is exist or not using email
    let userExist = await userModel.findOne({email});
    if(!userExist){
        return res.status(401).json({
            success: false,
            message: 'User is not registered. Please Sign-Up !!!'
        });
    }

    //* Verify password & generate a JWT token
    const payload = {
        email: userExist.email,
        id: userExist._id,
        role: userExist.role,
    }
    if(await bcrypt.compare(password, userExist.password)){
        //create token
        let token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: "2h"}) 

        //* Explicitly convert userExist to object
        userExist = userExist.toObject()
        //add another property in userExist object
        userExist.token = token;
        //Now remove password from userExist object not from DB
        userExist.password = undefined;

        const options= {
            expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("cookieToken", token, options).status(200).json({
            success: true,
            token,
            userExist,
            message: 'User Logged in Successfully'
        })

    }
    else{
        return res.status(403).json({
            success: false,
            message: 'Password Incorrect'
        });
    }
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to Login',
            errorMessage: error.message
        })    
    }
}