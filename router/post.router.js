const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Post } = require("../models/post.model");

router.route("/")
.get(async (req, res) => {
    try {
        const posts = await Post.find({}).sort("-createdAt").populate("user");
        res.json({ message: "success", posts });
    } catch(error) {
        console.log(error);
        res.status(404).json({ 
            success: false, 
            message: "check error message", 
            errorMessage: error.message
        });
    }
});

router.route("/getPosts/:profileId")
.get(async (req, res) => {
    const { profileId } = req.params;
    const posts = await Post.find({ user: profileId }).populate("user");

    res.json({ posts });
});

router.route("/like/:postId")
.post(async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        console.log("userId", userId);
        console.log("postId", postId);

        const post = await Post.findById(postId);
        console.log(post);

        let alreadyLiked = post.likes.some(likedUserId => likedUserId.toString() === userId );
        
        alreadyLiked ?
        post.likes.pull(userId) :
        post.likes.push(userId);

        await post.save();

        res.json({ success: true, post });
        
    } catch (error) {
        console.log(error);
        res.status(404).json({ 
            success: false, 
            message: "errMessage", 
            errorMessage: error.message 
        })
    }
});

router.route("/save/:postId")
.post(async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);

        let alreadySaved = post.savedPosts.some(likedUserId => likedUserId.toString() === userId );
        
        alreadySaved ?
        post.savedPosts.pull(userId) :
        post.savedPosts.push(userId);

        await post.save();

        res.json({ success: true, post });
        
    } catch (error) {
        console.log(error);
        res.status(404).json({ 
            success: false, 
            message: "errMessage", 
            errorMessage: error.message 
        })
    }
});

router.route("/new")
.post(async (req, res) => {
    try {
        const userId = req.userId;

        const { postInput, imageURL } = req.body;
        

        console.log(typeof imageURL);

        const addPost = new Post({ 
            _id: new mongoose.Types.ObjectId(),
            user: userId, 
            postContent: postInput.text,
            image: imageURL
        });
        
        const savePost = await addPost.save();

        const newPost = await Post.findById(addPost._id).populate("user");
        console.log(newPost);
        
        return res.json({ success: true, newPost });

    } catch(error) {
        console.log(error);
        res.status(404).json({ 
            success: false, 
            message: "check error message", 
            errorMessage: error.message 
        });
    }
});

module.exports = router;