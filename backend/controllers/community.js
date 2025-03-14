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
                community : communityCreated
            }
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