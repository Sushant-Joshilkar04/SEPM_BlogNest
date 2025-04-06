const User = require('../model/user')
const Post = require('../model/post')
const Community = require('../model/community');
const mongoose = require('mongoose');


exports.createcommunity = async (req,res) =>{
    try 
    {
        const { name, description, banner, category, autoJoin } = req.body;
        const creator = req.user.id;

        const communityCreated = await Community.create({
            name,
            description,
            banner,
            category,
            admin: creator,
            members: [creator]
        });

        const userUpdated = await User.findByIdAndUpdate(
            creator,
            {
                $push: {
                    community: communityCreated._id
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Community created successfully",
            data: communityCreated
        });
    }
    catch(error)
    {
        console.error("Error creating community:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

exports.getAllCommunities = async (req,res) =>{
    try 
    {
        const allCommunity = await Community.find({}).populate('posts').populate('admin').exec();
    
        return res.status(200).json({
            success : true,
            message : "Communities created successfully",
            data : allCommunity
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

exports.getCommunityById = async (req,res) => {
    try 
    {
        const id = req.params.id;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Community ID is required"
            });
        }

        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid community ID format"
            });
        }

        const community = await Community.findById(id).populate('posts').populate('admin').exec();
        
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Community fetched successfully",
            data: [community]
        });
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }    
}

exports.getCategories = async (req,res) => {
    try 
    {
        const category = await Community.find({},{category : 1});

        return res.status(200).json({
            success : true,
            message : "Community fetched successfully",
            data : category
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

exports.deleteCommunity = async (req,res) => {
    try 
    {
        const id = req.body.id;
        const { community } = req.body;

        const communityFound = await Community.find({admin : id,_id : community});

        if(!communityFound)
        {
            return res.status(403).json({
                success : false,
                message : "Access Denied"
            })
        }

        const communityDeleted = await Community.findByIdAndDelete(community,{new : true});
        const postUpdated = await Post.findOneAndUpdate({community : community},{
            community : null
        })
        const userUpdated = await User.findOneAndUpdate({community : community},{
            $pull : {
                community : community
            },
            adminOf : null
        })
        
        return res.status(200).json({
            success : true,
            message : "Community deleted successfully",
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


exports.updateCommunityName = async (req,res) => {
    try 
    {
        const id = req.body.id;
        const { community,name } = req.body;

        const communityFound = await Community.find({admin : id,_id : community});

        if(!communityFound)
        {
            return res.status(403).json({
                success : false,
                message : "Access Denied"
            })
        }

        const communityUpdated = await Community.findByIdAndUpdate({_id : community},{
            name : name
        },{new : true})


        return res.status(200).json({
            success : true,
            message : "Community deleted successfully",
            data : communityUpdated
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

exports.updateCommunityDescription = async (req,res) => {
    try 
    {
        const id = req.body.id;
        const { community,description } = req.body;

        const communityFound = await Community.find({admin : id,_id : community});

        if(!communityFound)
        {
            return res.status(403).json({
                success : false,
                message : "Access Denied"
            })
        }

        const communityUpdated = await Community.findByIdAndUpdate({_id : community},{
            description : description
        },{new : true})


        return res.status(200).json({
            success : true,
            message : "Community deleted successfully",
            data : communityUpdated
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

exports.joinCommunity = async (req,res) => {
    try 
    {
        const userId = req.user.id;
        const { communityId } = req.body;

        if (!communityId) {
            return res.status(400).json({
                success: false,
                message: "Community ID is required"
            });
        }

        const communityUpdated = await Community.findByIdAndUpdate(
            communityId,
            {
                $addToSet: { members: userId }
            },
            { new: true }
        );

        if (!communityUpdated) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        const userUpdated = await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { community: communityId }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Joined Community successfully",
        });
    }
    catch(error)
    {
        console.error("Error joining community:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }  
}

exports.leaveCommunity = async (req,res) => {
    try 
    {
        const userId = req.user.id;
        const { communityId } = req.body;

        if (!communityId) {
            return res.status(400).json({
                success: false,
                message: "Community ID is required"
            });
        }

        const communityUpdated = await Community.findByIdAndUpdate(
            communityId,
            {
                $pull: { members: userId }
            },
            { new: true }
        );

        if (!communityUpdated) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        const userUpdated = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { community: communityId }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Left Community successfully",
        });
    }
    catch(error)
    {
        console.error("Error leaving community:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }  
}

exports.getUserCommunities = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const communities = await Community.find({ members: userId })
            .populate('admin', 'firstName lastName')
            .exec();
        
        res.status(200).json({
            success: true,
            message: "User communities fetched successfully",
            data: communities
        });
    } catch (error) {
        console.error('Error getting user communities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user communities'
        });
    }
};
