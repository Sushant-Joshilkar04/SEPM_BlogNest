const jwt = require('jsonwebtoken')

require('dotenv').config()

exports.auth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "No token provided or invalid token format"
            });
        }

        // Extract the token (remove 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required"
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Add user info to request
            req.body.id = decoded.id;
            req.body.role = decoded.role;
            
            next();
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

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