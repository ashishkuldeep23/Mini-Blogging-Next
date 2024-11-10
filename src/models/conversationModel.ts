import mongoose from "mongoose";

//  ref 

const conversationScheam = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],

    // members: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // }],

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }],
    pinned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }],
    type: {
        type: String,
        enum: ['personal', 'group']
    },
    personalId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    groupId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups'
    }],
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


