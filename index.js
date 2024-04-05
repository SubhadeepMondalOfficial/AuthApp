//require @express npm package
const express = require('express');
const app = express();

//require @dotenv npm package
require('dotenv').config()
const PORT = process.env.PORT || 4000;

//middleware to parse json request body
app.use(express.json())

//import route for AuthApp
const user = require('./routes/userRoutes')
//mount/prefix the AuthApp API routes
app.use('/api/v1', user);

//listen app
app.listen(PORT, () => {
    console.log(`Server Running at Port- ${PORT}`);
})

//require database file and call it
const dbConnect = require('./config/database')
dbConnect();

//default home page route
app.get('/', (req, res) => {
    res.send('<h1>You are connected to Auth App </h1>')
})