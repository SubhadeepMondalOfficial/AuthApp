const express = require('express');
const router = express.Router();

//import controllers
const {login, signup} = require('../controllers/userController');
const {auth, isStudent, isAdmin} = require('../middlewares/userMiddleware')

//define various routes or path and map with conroller
router.post('/login', login)
router.post('/signup', signup)

// Testing Route for Middleware
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'test successfull'
    })
})

//!=============== Protected Routes ================
router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Protected route for Students'
    })
})

router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Protected route for Admins'
    })
})

module.exports = router