const User = require('../model/user')
const Post = require('../model/post')
const Community = require('../model/community')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const fileUpload = async (file, folder, height=null, quality=null) => {
    try {
        const options = { folder };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }

        options.resource_type = "auto";

        const response = await cloudinary.uploader.upload(file.tempFilePath, options);

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.createpost = async (req,res)=>{
    try 
    {
        const banner = req.files.banner;
        const {id,title,tags,community=null,content} = req.body;

        const bannerUploaded = await fileUpload(banner,process.env.FOLDER);

        const postCreated = await Post.create({title : title,author : id,tags : tags,community : community,content : content,banner : bannerUploaded.url});
        const userUpdated = await User.findByIdAndUpdate(id,{
            $push : {
                posts : postCreated._id
            }
        },{new : true});

        if(community)
        {
            const communityUpdated = await Community.findByIdAndUpdate(community,{
                $push : 
                {
                    posts : postCreated._id
                }
            })
        }

        return res.status(200).json({
            success : true,
            message : "Post created successfully"
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

exports.getAllposts = async (req,res) => {
    try 
    {
        const allPost = await Post.find({}).populate('author').populate('community').exec();

        return res.status(200).json({
            success : true,
            message : "Post fetched successfully",
            data : allPost
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

exports.getPostById = async (req,res) => {
    try 
    {
        const id = req.params.id;

        const post = await Post.find({_id : id}).populate('author').populate('community').exec();

        return res.status(200).json({
            success : true,
            message : "Post fetched successfully",
            data : post
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

exports.deletePost = async (req,res) =>{
    try 
    {
        const postId = req.body.postId;

        const postDeleted = await Post.findByIdAndDelete({_id : postId},{new : true});
        const userUpdated = await User.findByIdAndUpdate({_id : postDeleted.author},{
            $pull : {
                posts : postDeleted._id
            }
        })

        if(postDeleted.community)
        {
            const communityUpdated = await Community.findByIdAndUpdate({_id : postDeleted.community},{
                $pull : {
                    posts : postDeleted._id
                }
            })
        }
        
        return res.status(200).json({
            success : true,
            message : "Post deleted successfully",
            data : postDeleted
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

exports.updatePostTitle = async (req,res) =>{
    try 
    {
        const postId = req.body.postId;
        const title = req.body.title;

        const postUpdated = await Post.findByIdAndUpdate(postId,{
            title : title
        },{new : true})
        
        return res.status(200).json({
            success : true,
            message : "Post title updated successfully",
            data : postUpdated
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

exports.updatePostContent = async (req,res) =>{
    try 
    {
        const postId = req.body.postId;
        const content = req.body.content;

        const postUpdated = await Post.findByIdAndUpdate(postId,{
            content : content
        },{new : true})
        
        return res.status(200).json({
            success : true,
            message : "Post content updated successfully",
            data : postUpdated
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


exports.reportpost = async (req,res) => {
    try 
    {
        const postId = req.body.postId;

        const postUpdated = await Post.findByIdAndUpdate(postId,{
            $inc : 
            { 
                reportCount : 1
            }
        },{new : true})

        if(postUpdated.reportCount>=10)
        {
            await Post.findByIdAndUpdate(postId,{
                isValid : false
            })
            
        }
        
        return res.status(200).json({
            success : true,
            message : "Post reported successfully",
            data : postUpdated
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

exports.addImpression = async (req,res) => {
    try 
    {
        const postId = req.body.postId;

        const postUpdated = await Post.findByIdAndUpdate(postId,{
            $inc : 
            { 
                impressions : 1
            }
        },{new : true})

        return res.status(200).json({
            success : true,
            message : "Post impressions updated successfully",
            data : postUpdated
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

exports.addLike = async (req,res) => {
    try 
    {
        const id = req.body.id;
        const postId = req.body.postId;

        const postUpdated = await Post.findByIdAndUpdate(postId,{
            $inc : 
            { 
                likes : 1
            }
        },{new : true})

        const userUpdated = await User.findByIdAndUpdate(id,{
            $push : {
                likedPosts : postId
            }
        })

        return res.status(200).json({
            success : true,
            message : "Post likes updated successfully",
            data : postUpdated
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