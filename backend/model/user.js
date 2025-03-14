const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String,
    required: true 
},
  lastName: { 
    type: String,
    required: true
},
  email: { 
    type: String,
    required: true,
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
  role: { 
    type: String,
    enum: ["user", "admin"],
    default: "user" 
},
posts : [ {type : mongoose.Schema.Types.ObjectId , ref : 'Post'}],
community : [ {type : mongoose.Schema.Types.ObjectId , ref : 'Communit'}]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
