import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        default: "Title of post.",
        trim: true
    },
    category: {
        type: String,
        required: true,
        default: "Category of post.",
        trim: true
    },
    promptReturn: {
        type: String,
        trim: true,
        required: true,
        default: "Prompt Return.",
    },
    urlOfPrompt: {
        type: String,
        default: '',
        trim: true,
    },
    aiToolName: {
        type: String,
        trim: true,
        default: '',
    },
    hashthats: {
        type: [String],
        default: [],
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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        // default: [],
        ref: "comments"
    },

    // comments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }] ,

    isDeleted: {
        type: Boolean,
        default: false
    },
    whenCreated: {
        type: String,
        default: () => {
            let a = new Date()
            return a.toLocaleDateString()
        }
    }

}, { timestamps: true })


const Post = mongoose.models.posts || mongoose.model("posts", PostSchema);

export default Post;


