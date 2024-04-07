import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "Please provide a username"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        trim: true
    },
    profilePic: {
        type: String,
        default : "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

    forgotPassToken: {
        type: String,
        default: ""
    },
    forgotPassExp: {
        type: Date,
        default: null
    },
    verifyToken: {
        type: String,
        default: ""
    },
    verifyTokenExp: {
        type: Date,
        default: null
    }

}, { timestamps: true })



// // // Creating models in next js by userSchema --->

// const User = 

export default mongoose.models.users || mongoose.model("users", userSchema);

