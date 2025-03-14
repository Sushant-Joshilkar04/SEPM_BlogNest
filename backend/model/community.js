const mongoose =  require('mongoose');


const schema = new mongoose.Schema({
    name : String,
    createdAt :  { type : Date , default : Date.now},
    members : [ { type : mongoose.Schema.Types.ObjectId , ref : 'User' }],
    description : String,
    banner : String,
    category : String,
    tags : [{type : String}],
    admin : { type : mongoose.Schema.Types.ObjectId , ref : 'User' },
    posts : [ { type : mongoose.Schema.Types.ObjectId , ref : 'Post' } ],
})

module.exports = mongoose.model('Community',schema);