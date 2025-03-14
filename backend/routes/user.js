const express = require("express");
const router = express.Router();

const {auth,isUser,isAdmin} = require('../middleware/auth')
const { signup, login ,getAllUser,getUserById,getReportedPost,approvePost} = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", login);
router.get('/getalluser',getAllUser);
router.get('/getuser/:id',getUserById);
router.get('/getreportedpost',getReportedPost);
router.post('/approvepost',auth,isAdmin,approvePost)

module.exports = router;
