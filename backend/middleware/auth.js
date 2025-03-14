const jwt = require('jsonwebtoken')

require('dotenv').config()

exports.auth = async (req,res,next)=>{
    try 
    {
        const token = req.body.token || req.cookies.token;

        if(!token)
        {
            return res.status(402).json({
                success : false,
                message : "Invalid token"
            })
        }

        const jwtDecoded = jwt.verify(token,process.env.JWT_SECRET);

        const id = jwtDecoded.id;
        const role = jwtDecoded.role;

        req.body.id = id;
        req.body.role = role;

        next();
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


exports.isUser = (req,res,next) =>{
    try 
    {
        const role = req.body.role;

        if(role !== 'user')
        {
            return res.status(403).json({
                success : false,
                message : "Access Denied"
            })
        }

        next();
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


exports.isAdmin = (req,res,next) =>{
    try 
    {
        const role = req.body.role;

        if(role !== 'admin')
        {
            return res.status(403).json({
                success : false,
                message : "Access Denied"
            })
        }

        next();
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