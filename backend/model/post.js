const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title : String,
    banner: { 
        type: String, 
        required: true
      },
    author : { type : mongoose.Schema.Types.ObjectId , ref : 'User'} ,
    createdAt : { type : Date , default : Date.now},
    tags : [{type : String}],
    community : { type : mongoose.Schema.Types.ObjectId , ref : 'Community',default: null},
    likes : { type : Number , default : 0} ,
    impressions : { type : Number , default : 0},
    content : String,
    isValid : { type : Boolean , default : true },
    reportCount : {type : Number, default : 1},
    banner : String
})

module.exports = mongoose.model('Post',schema);