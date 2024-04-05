//require @mongoose from npm package to connect with mongoDB
const mongoose = require("mongoose");

//require @dotenv npm package
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Database connected successfully`);
    })
    .catch((error) => {
      console.log("Failed to Connect with Database");
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
