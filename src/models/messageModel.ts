import mongoose, { Mongoose } from "mongoose";


const messageScheam = new mongoose.Schema({

    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversations"
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    text: {
        type: String,
        default: "",
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    },
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
    },

}, { timestamps: true })


const messageModel = mongoose.models.messages || mongoose.model("messages", messageScheam);

export default messageModel;

