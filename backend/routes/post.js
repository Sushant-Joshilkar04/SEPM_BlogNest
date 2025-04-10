const express = require('express')
const postRouter = express.Router();

const {createpost,getAllposts,getPostById,deletePost,updatePostTitle,updatePostContent,reportpost,addImpression,addLike,getPostBasedOnTags,getCommunityPosts,publishDraft,removeLike,unreportPost,checkLikeStatus,checkReportStatus} = require('../controllers/post') 
const {auth,isUser,isAdmin} = require('../middleware/auth')

postRouter.post('/createpost',auth,isUser,createpost);
postRouter.get('/getallpost',getAllposts);
postRouter.get('/getpost/:id',getPostById);
postRouter.delete('/deletepost',auth,isUser,deletePost);
postRouter.delete('/removepost',auth,isAdmin,deletePost);
postRouter.put('/updateposttitle',auth,isUser,updatePostTitle);
postRouter.put('/updatepostcontent',auth,isUser,updatePostContent);
postRouter.post('/reportpost',auth,isUser,reportpost);
postRouter.post('/unreportpost',auth,isUser,unreportPost);
postRouter.post('/addimpressions',addImpression);
postRouter.post('/addlike',auth,isUser,addLike);
postRouter.post('/removelike',auth,isUser,removeLike);
postRouter.get('/getsimilarpost',getPostBasedOnTags);
postRouter.get('/getcommunityposts/:communityId', auth, getCommunityPosts);
postRouter.put('/publishdraft',auth,isUser,publishDraft);
postRouter.get('/checklike/:id', auth, isUser, checkLikeStatus);
postRouter.get('/checkreport/:id', auth, isUser, checkReportStatus);

module.exports = postRouter;