const express = require('express');
const communityRouter = express.Router();

const {auth,isUser} = require('../middleware/auth')
const {createcommunity,getAllCommunities,getCommunityById,getCategories,deleteCommunity,updateCommunityName, updateCommunityDescription,joinCommunity,leaveCommunity,getUserCommunities} = require('../controllers/community');
const community = require('../model/community');

communityRouter.post('/createcommunity',auth,isUser,createcommunity);
communityRouter.get('/getAllCommunities',getAllCommunities);
communityRouter.get('/getcommunity/:id',getCommunityById);
communityRouter.get('/getcategory',getCategories);
communityRouter.delete('/deletecommunity',auth,isUser,deleteCommunity);
communityRouter.post('/updatecommunityname',auth,isUser,updateCommunityName);
communityRouter.post('/updatecommunitydescription',auth,isUser,updateCommunityDescription);
communityRouter.post('/joincommunity',auth,isUser,joinCommunity);
communityRouter.delete('/leavecommunity',auth,isUser,leaveCommunity);
communityRouter.get('/getUserCommunities/:userId', auth, getUserCommunities);

module.exports = communityRouter;