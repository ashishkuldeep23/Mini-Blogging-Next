import mongoose from "mongoose";


const ReplyScheam = new mongoose.Schema({

    reply: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    },
    whenCreated: {
        type: String,
        default: () => {
            let a = new Date()
            return a.toLocaleDateString()
        }
    }

}, { timestamps: true })


const Reply = mongoose.models.replies || mongoose.model("replies", ReplyScheam);

export default Reply;



