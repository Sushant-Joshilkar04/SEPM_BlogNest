const express = require('express')
const postRouter = express.Router();

const {createpost,getAllposts,getPostById,deletePost,updatePostTitle,updatePostContent,reportpost} = require('../controllers/post') 
const {auth,isUser} = require('../middleware/auth')

postRouter.put('/createpost',auth,isUser,createpost);
postRouter.get('/getallpost',getAllposts);
postRouter.get('/getpost/:id',getPostById);
postRouter.delete('/deletepost',auth,isUser,deletePost);
postRouter.post('/updateposttitle',auth,isUser,updatePostTitle);
postRouter.post('/updatepostcontent',auth,isUser,updatePostContent);
postRouter.post('/reportpost',auth,isUser,reportpost);

module.exports = postRouter;