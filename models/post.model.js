const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostScehma = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    postContent: {
        type: String,
        trim: true,
        required: "Please enter post content",
        maxLen: 250
    },

    image: {
        type: String,
    },
    
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],

    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        comment: {
            type: String,
            required: true
        }
    }],


}, { timestamps: true });

const Post = mongoose.model("Post", PostScehma);

module.exports = { Post };