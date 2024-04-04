import mongoose from "mongoose";


const commentsScheam = new mongoose.Schema({

    comment: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likesId: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "users"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "replies"
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
    whenCreated: {
        type: String,
        default: () => {
            let a = new Date()
            return a.toLocaleDateString()
        }
    }

}, { timestamps: true })


const Comment = mongoose.models.comments || mongoose.model("comments", commentsScheam);

export default Comment;



