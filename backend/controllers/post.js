const User = require('../model/user')
const Post = require('../model/post')
const Community = require('../model/community')

exports.createpost = async (req,res)=>{
    try 
    {
        const {id,title,tags,community=null,content} = req.body;

        const postCreated = await Post.create({title : title,author : id,tags : tags,community : community,content : content});
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
            message : "Post created successfully",
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