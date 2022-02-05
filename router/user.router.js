const { User } = require("../models/user.model");
const { verifyToken } = require("../middlewares/authenticateToken");
const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const router = express.Router();
dotenv.config();

router.route("/login")
.post(async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const user = await User.findOne({ email });

        if (user === null) {
            return res.status(401).json({ 
                success: false,
                message: "Email does not exist. Please sign up."
            })
        };
        
        let matchPassword = await bcrypt.compare(password, user.password);
        
        if(!matchPassword) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        };

        const secret = process.env.JWT_SECRET;

        const token = jwt.sign(
            { userId: user._id },
            secret,
            {expiresIn: "24h"}
        );

        return res.json({
            success: true,
            message: "Auth success",
            userId: user._id,
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            bio: user.bio
        });

        
    } catch(error) {
        console.log(error);
        return res.status(401).json({ 
            success: false, 
            message: "Auth failed", 
            errorMessage:  error.message 
        });
    }
});

router.route("/signup")
.post(async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        const user = await User.findOne({ email });
        
        if(user !== null) {
            return res.status(409).json({
                success: false,
                message: "Email already exists. Please login"
            });
        };

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({ 
            firstName, 
            lastName, 
            username, 
            email, 
            password: hashedPassword 
        });

        const saveNewUser = await newUser.save();
        console.log(saveNewUser);

        const secret = process.env.JWT_SECRET;

        const token = jwt.sign(
            { userId: saveNewUser._id}, 
            secret, 
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            message: "Sign up successful",
            userId: saveNewUser._id,
            token,
            username,
            firstName: saveNewUser.firstName,
            lastName: saveNewUser.lastName,
            bio: saveNewUser.bio
        });

    } catch(error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Sign up failed",
            errorMessage: error.message
        })
    }
});

router.route("/profile/:userId")
.get(async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        res.json({ 
            success: true,
            user 
        });

    } catch(error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "check error message",
            errorMessage: error.message
        })
    }

});

router.post("/editBio", verifyToken, async (req, res) => {
    try {  
        const { bio } = req.body;
        const userId = req.userId;
        
        const user = await User.findById(userId);

        user.bio = bio

        const userDetails = await user.save();
        res.json({ success: true, userDetails });

    } catch(error) {
        console.log({error});
        res.status(404).json({
            success: false,
            message: "check error message",
            errorMessage: error.message
        })
    }
});

router.route("/allUsers")
.get(async (req, res) => {
    try {
        const allUsers = await User.find({});
    
        res.json({ success: true, allUsers });
    } catch(error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "check error message",
            errorMessage: error.message
        })
    }
});

router.post("/followUser/:profileId", verifyToken, async (req, res) => {
    try {
        const { userId } = req;
        const { profileId } = req.params;

        console.log("userId", userId, profileId);
        
        const user = await User.findById(userId);
        const userToBeFollowed = await User.findById(profileId);

        const alreadyFollowing = user.followingList.includes(profileId);

        alreadyFollowing 
        ? user.followingList.pull(profileId) 
        : user.followingList.push(profileId);

        const alreadyFollower = userToBeFollowed.followersList.includes(userId);

        alreadyFollower 
        ? userToBeFollowed.followersList.pull(userId)
        : userToBeFollowed.followersList.push(userId);

        await user.save();
        await userToBeFollowed.save();

        // const updatedUser = await user.populate("followingList");
        // let followingList = updatedUser.followingList;
        
        const followersList = userToBeFollowed.followersList;
        console.log(followersList);

        return res.json({ success: true, followersList });

    } catch(error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "check error message",
            errorMessage: error.message
        });
    };
});

router.route("/followers/:profileId")
.get(async (req, res) => {
    try {
        const { profileId } = req.params;
    } catch(error) {
        console.log(error);
    }
});

module.exports = router;