import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      trim: true,
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1717510373/yqrqev3nq8yrbdkct3no.jpg",
    },
    allProfilePic: {
      type: Array,
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    forgotPassToken: {
      type: String,
      default: "",
    },
    forgotPassExp: {
      type: Date,
      default: null,
    },
    verifyToken: {
      type: String,
      default: "",
    },
    verifyTokenExp: {
      type: Date,
      default: null,
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "users",
    },
    whoSeenProfile: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "users",
    },
    sendRequest: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "users",
    },
    reciveRequest: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "users",
    },
    notification: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "notifications",
    },

    isOnline: { type: Boolean, default: false },

    lastSeen: { type: Date, default: Date.now },

    blockedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "users",
    },

    // // // Creating save and block post feature now -------->>
    savedPost: {
      type: Map,
      of: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "posts",
        },
      ],
      default: {}, //  default to empty object
    },
  },
  { timestamps: true }
);

// // // Creating models in next js by userSchema --->

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
