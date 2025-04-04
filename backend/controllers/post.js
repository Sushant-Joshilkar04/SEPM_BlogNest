const User = require('../model/user')
const Post = require('../model/post')
const Community = require('../model/community')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const mongoose = require('mongoose');

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

exports.deletePost = async (req, res) => {
    try {
      const { postId } = req.body;
      
      // Find the post first to get author and community info
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        });
      }
  
      // Delete the post
      await Post.findByIdAndDelete(postId);
  
      // Remove post reference from author's posts array
      if (post.author) {
        await User.findByIdAndUpdate(
          post.author,
          { $pull: { posts: postId } },
          { new: true }
        );
      }
  
      // Remove post reference from community if it exists
      if (post.community) {
        await Community.findByIdAndUpdate(
          post.community,
          { $pull: { posts: postId } },
          { new: true }
        );
      }
  
      // Delete banner image from cloudinary if exists
      if (post.banner) {
        try {
          const publicId = post.banner.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.log("Error deleting image from cloudinary:", cloudinaryError);
        }
      }
  
      return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
      });
    } catch (error) {
      console.error("Delete post error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  };

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

exports.reportpost = async (req, res) => {
    try {
        const { postId } = req.body;
        // Get userId from authenticated user
        const userId = req.user.id;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user has already reported this post
        if (post.reported_by && post.reported_by.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this post"
            });
        }

        // Update post to increment report count and add user to reported_by array
        const postUpdated = await Post.findByIdAndUpdate(postId, {
            $inc: { reportCount: 1 },
            $push: { reported_by: userId }
        }, { new: true });

        // If report count >= 10, mark post as invalid
        if (postUpdated.reportCount >= 10) {
            await Post.findByIdAndUpdate(postId, {
                isValid: false
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post reported successfully",
            data: postUpdated
        });
    } catch (error) {
        console.log("Report post error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

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

exports.getCommunityPosts = async (req, res) => {
    try {
        const communityId = req.params.communityId;
        console.log('Fetching posts for community:', communityId);
        
        if (!communityId) {
            return res.status(400).json({
                success: false,
                message: "Community ID is required"
            });
        }

        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(communityId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid community ID format"
            });
        }

        const posts = await Post.find({ community: communityId })
            .populate('author', 'firstName lastName')
            .populate('community', 'name')
            .sort({ createdAt: -1 })
            .exec();

        console.log('Found posts:', posts.length);

        return res.status(200).json({
            success: true,
            message: "Community posts fetched successfully",
            data: posts
        });
    } catch (error) {
        console.error('Error in getCommunityPosts:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.publishDraft = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.body.id;

        // Find the post and verify ownership
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to publish this draft"
            });
        }

        // Update the post to published status
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { isDraft: false },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Draft published successfully",
            data: updatedPost
        });
    } catch (error) {
        console.error("Error publishing draft:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.removeLike = async (req, res) => {
    try {
        const id = req.body.id;
        const postId = req.body.postId;

        // Find post and check if it exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user has liked the post
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const hasLiked = user.likedPosts.includes(postId);
        if (!hasLiked) {
            return res.status(400).json({
                success: false,
                message: "You have not liked this post"
            });
        }

        // Decrement like count
        const postUpdated = await Post.findByIdAndUpdate(postId, {
            $inc: { likes: -1 }
        }, { new: true });

        // Remove post from user's liked posts
        await User.findByIdAndUpdate(id, {
            $pull: { likedPosts: postId }
        });

        return res.status(200).json({
            success: true,
            message: "Post unliked successfully",
            data: postUpdated
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.unreportPost = async (req, res) => {
    try {
        const { postId } = req.body;
        // Get userId from authenticated user
        const userId = req.user.id;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user has reported the post
        // If not already reported, return error
        if (!post.reported_by || !post.reported_by.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have not reported this post"
            });
        }

        // Decrement report count and remove user from reported_by array
        const postUpdated = await Post.findByIdAndUpdate(postId, {
            $inc: { reportCount: -1 },
            $pull: { reported_by: userId }
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Report removed successfully",
            data: postUpdated
        });
    } catch (error) {
        console.log("Unreport post error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.checkLikeStatus = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Find user and check if post is in likedPosts array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isLiked = user.likedPosts && user.likedPosts.includes(postId);

        return res.status(200).json({
            success: true,
            isLiked
        });
    } catch (error) {
        console.log("Check like status error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.checkReportStatus = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Find post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user has reported the post
        const isReported = post.reported_by && post.reported_by.includes(userId);

        return res.status(200).json({
            success: true,
            isReported
        });
    } catch (error) {
        console.log("Check report status error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

