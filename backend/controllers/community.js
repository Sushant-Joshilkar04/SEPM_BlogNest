const User = require('../model/user')
const Post = require('../model/post')
const Community = require('../model/community');


exports.createcommunity = async (req,res) =>{
    try 
    {
        const admin = req.body.id;
        const {name,description,category,tags} = req.body;

        const communityCreated = await Community.create({name : name,description : description,admin : admin,category : category,tags: tags});
        const userUpdated = await User.findByIdAndUpdate( { _id : admin },{
            $push : {
                community : communityCreated._id
            },
            adminOf : communityCreated._id
        })

        return res.status(200).json({
            success : true,
            message : "community created successfully"
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
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

        const community = await Community.find({_id : id}).populate('posts').populate('admin').exec();

        return res.status(200).json({
            success : true,
            message : "Community fetched successfully",
            data : community
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
        const id = req.body.id;
        const community = req.body.community;

        const communityUpdated = await Community.findByIdAndUpdate({_id : community},{
            $push : {
                members : id
            }
        })
        const userUpdated = await User.findByIdAndUpdate({_id : id},{
            $push : 
            {
                community : community
            }
        })

        return res.status(200).json({
            success : true,
            message : "Joined Community successfully",
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

exports.leaveCommunity = async (req,res) => {
    try 
    {
        const id = req.body.id;
        const community = req.body.community;

        const communityUpdated = await Community.findByIdAndUpdate({_id : community},{
            $pull : {
                members : id
            }
        })
        const userUpdated = await User.findByIdAndUpdate({_id : id},{
            $pull : {
                community : community
            }
        })

        return res.status(200).json({
            success : true,
            message : "Left Community successfully",
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
