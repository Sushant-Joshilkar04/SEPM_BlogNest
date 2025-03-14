const mongoose =  require('mongoose');


const schema = new mongoose.Schema({
    name : String,
    createdAt : Date.now,
    members : [ { type : mongoose.Schema.Types.ObjectId , ref : 'User' }],
    description : String,
    banner : String,
    admin : { type : mongoose.Schema.Types.ObjectId , ref : 'User' },
    post : [ { type : mongoose.Schema.Types.ObjectId , ref : 'Post' } ],
})

module.exports = mongoose.model('Community',schema);