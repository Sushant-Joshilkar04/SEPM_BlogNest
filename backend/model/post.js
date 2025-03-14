const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title : String,
    author : { type : mongoose.Schema.Types.ObjectId , ref : 'User'} ,
    createdAt : Date.now,
    tags : [{type : String}],
    community : { type : mongoose.Schema.Types.ObjectId , ref : 'Community'},
    likes : Number,
    impressions : Number,
})

module.exports = mongoose.model('Post',schema);