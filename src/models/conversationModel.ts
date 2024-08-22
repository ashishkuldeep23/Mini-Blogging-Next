import mongoose from "mongoose";


const conversationScheam = new mongoose.Schema({

    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "users"
    },
    type: {
        type: String,
        enum: ['personal', 'group']
    },

    whenCreated: {
        type: String,
        default: () => {
            let a = new Date()
            return a.toLocaleDateString()
        }
    }

}, { timestamps: true })


const ConversationsModel = mongoose.models.conversations || mongoose.model("conversations", conversationScheam);

export default ConversationsModel;


