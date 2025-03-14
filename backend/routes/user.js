const express = require("express");
const router = express.Router();

const {auth,isUser} = require('../middleware/auth')
const { signup, login ,getAllUser,getUserById} = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", login);
router.get('/getalluser',getAllUser);
router.get('/getuser/:id',getUserById)

module.exports = router;
