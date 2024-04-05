const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requied: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    requied: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Student", "Visitor"],
  },
});

// Export mongoose Schema as model name- user and if in DB there is no such collection name then it automatically create collection name as "users"
module.exports = mongoose.model("user", userSchema);
