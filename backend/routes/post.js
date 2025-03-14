const express = require('express')
const postRouter = express.Router();

const {createpost,getAllposts,getPostById,deletePost} = require('../controllers/post') 
const {auth,isUser} = require('../middleware/auth')

postRouter.put('/createpost',auth,isUser,createpost);
postRouter.get('/getallpost',getAllposts);
postRouter.get('/getpost/:id',getPostById);
postRouter.delete('/deletepost',auth,isUser,deletePost);

module.exports = postRouter;