const express = require("express");
const router = express.Router();

const {auth,isUser,isAdmin} = require('../middleware/auth')
const { signup, login ,getAllUser,getUserById,getReportedPost,approvePost, deletePost} = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", login);
router.get('/getalluser',auth,getAllUser);
router.get('/getuser/:id',getUserById);
router.get('/getreportedpost',auth,isAdmin,getReportedPost);
router.post('/approvepost',auth,isAdmin,approvePost)
router.delete('/deletepost/:id', auth, isAdmin, deletePost)

module.exports = router;
