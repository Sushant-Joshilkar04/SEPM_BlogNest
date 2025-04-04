const User = require("../model/user");
const Post = require('../model/post')
const Community = require('../model/community');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {deletePost} = require('../controllers/post')
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;


    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar : `http://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", data : newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if the role matches
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid role for this account." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
exports.getAllUser = async (req,res) => {
try 
    {
        const allUsers = await User.find({}).populate('posts').populate('community').exec();
    
        return res.status(200).json({
            success : true,
            message : "Users fetched successfully",
            data : allUsers
        })
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }  
}

exports.getUserById = async (req,res) => {
  try 
      {
          const id = req.params.id;
          const user = await User.find({_id : id}).populate('posts').populate('community').exec();
      
          return res.status(200).json({
              success : true,
              message : "User fetched successfully",
              data : user
          })
      }
      catch(error)
      {
          console.log(error.message);
          return res.status(500).json({
              success : false,
              message : "Internal Server Error"
          })
      }  
  }

exports.getReportedPost = async (req,res) => {
  try 
  {
      const reportedPosts = await Post.find({ 
        $or: [
          { isValid: false },
          { reportCount: { $gt: 10 } }
        ]
      })
      .populate({
        path: 'author',
        select: 'firstName lastName email avatar'
      })
      .exec();
  
      return res.status(200).json({
          success : true,
          message : "Reported posts fetched successfully",
          data : reportedPosts
      })
  }
  catch(error)
  {
      console.log("Error in getReportedPost:", error.message);
      return res.status(500).json({
          success : false,
          message : "Internal Server Error"
      })
  }  
}

exports.approvePost = async (req,res) => {
  try 
  {
      const postId = req.body.postId;

      const postUpdated = await Post.findByIdAndUpdate(postId,{
        isValid : true,
        reportCount : 0
      })
  
      return res.status(200).json({
          success : true,
          message : "Post approved successfully",
      })
  }
  catch(error)
  {
      console.log(error.message);
      return res.status(500).json({
          success : false,
          message : "Internal Server Error"
      })
  } 
}

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

