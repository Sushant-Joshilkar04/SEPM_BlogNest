const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/user");
const postRouter = require('./routes/post');
const communityRouter = require('./routes/community')
require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.error("MongoDB connection failed:", error));


    
const connectCloudinary = ()=>{
    try 
    {
        cloudinary.config({ 
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.CLOUD_API_KEY,
            api_secret : process.env.CLOUD_API_SECRET
    })
    
    console.log("Cloudinary connected successfully");
    }
    catch(error)
    {
        console.log("connectCloudinary",error.message);
    }
}

connectCloudinary();
    

app.use(cors());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/post',postRouter);
app.use('/api/community',communityRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
