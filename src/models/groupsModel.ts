import mongoose from "mongoose";


const groupScheam = new mongoose.Schema({

    name : {
        type : String ,
        default : "",
        required : true
    },
    description : {
        type : String ,
        default : "",
        required : true
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "users"
    },
    admins: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "users"
    },
    whenCreated: {
        type: String,
        default: () => {
            let a = new Date()
            return a.toLocaleDateString()
        }
    }

}, { timestamps: true })


const groupsModel = mongoose.models.groups || mongoose.model("groups", groupScheam);

export default groupsModel;


