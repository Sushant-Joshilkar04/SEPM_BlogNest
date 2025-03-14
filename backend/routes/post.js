const express = require('express')
const postRouter = express.Router();

const {createpost,getAllposts,getPostById,deletePost,updatePostTitle,updatePostContent,reportpost,addImpression,addLike,getPostBasedOnTags} = require('../controllers/post') 
const {auth,isUser,isAdmin} = require('../middleware/auth')

postRouter.put('/createpost',auth,isUser,createpost);
postRouter.get('/getallpost',getAllposts);
postRouter.get('/getpost/:id',getPostById);
postRouter.delete('/deletepost',auth,isUser,deletePost);
postRouter.delete('/removepost',auth,isAdmin,deletePost);
postRouter.post('/updateposttitle',auth,isUser,updatePostTitle);
postRouter.post('/updatepostcontent',auth,isUser,updatePostContent);
postRouter.post('/reportpost',auth,isUser,reportpost);
postRouter.post('/addimpressions',addImpression);
postRouter.post('/addlike',auth,isUser,addLike);
postRouter.get('/getsimilarpost',getPostBasedOnTags);

module.exports = postRouter;