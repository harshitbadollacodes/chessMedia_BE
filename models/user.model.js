const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: "Please enter first name"
    },
    lastName: {
        type: String,
        trim: true,
        required: "Please enter last name"
    },
    username: {
        type: String,
        trim: true,
        required: "Please enter username"
    },
    email: {
        type: String,
        trim: true,
        required: "Please enter email",
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: "Please enter password",
    },

    bio: {
        type: String,
        trim: true,
        default: "Hi there! I'm a member of knight club!!"
    },

    displayPicture: {
        type: String,
        default: "https://res.cloudinary.com/dwrcvgzi0/image/upload/v1646990046/v0roqzc5ojjseyv8dplk.png"
    },

    followingList: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    followersList: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    likedPost: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],

    savedPosts: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }]

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = { User };