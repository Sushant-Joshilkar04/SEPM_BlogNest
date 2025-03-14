const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/user");
const postRouter = require('./routes/post');
const communityRouter = require('./routes/community')
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.error("MongoDB connection failed:", error));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/post',postRouter);
app.use('/api/community',communityRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
