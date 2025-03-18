const User = require('../model/user')
const Post = require('../model/post')
const Community = require('../model/community')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

exports.createpost = async (req, res) => {
    try {
        const { id, title, tags, community, content, bannerUrl, isDraft } = req.body;
        console.log("Received data:", req.body);

        if (!id || !title || !content || !bannerUrl) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Parse tags
        let parsedTags = [];
        try {
            parsedTags = tags ? JSON.parse(tags) : [];
        } catch (error) {
            console.log("Tags parsing error:", error);
            parsedTags = [];
        }

        const post = await Post.create({
            title,
            content,
            banner: bannerUrl,
            author: id,
            tags: parsedTags,
            community: community || null,
            isDraft: Boolean(isDraft)
        });

        // Update user's posts array
        await User.findByIdAndUpdate(
            id,
            { $push: { posts: post._id } },
            { new: true }
        );

        // Update community if specified
        if (community) {
            await Community.findByIdAndUpdate(
                community,
                { $push: { posts: post._id } },
                { new: true }
            );
        }

        return res.status(201).json({
            success: true,
            message: isDraft ? "Blog saved as draft" : "Blog published successfully",
            data: post
        });

    } catch (error) {
        console.error("Create post error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

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

exports.getPostBasedOnTags = async (req,res) => {
    try 
    {
        const {tags} = req.body;

        const taggedPosts = await Post.find({
            tags : {
                $in : tags
            }
        });

        return res.status(200).json({
            success : true,
            message : "Posts of similar tags fetched successfully",
            data : taggedPosts
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