const express = require('express');
const communityRouter = express.Router();

const {auth,isUser} = require('../middleware/auth')
const {createcommunity} = require('../controllers/community')

communityRouter.put('/createcommunity',auth,isUser,createcommunity);


module.exports = communityRouter;