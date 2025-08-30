import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./userModel";
import MessageModel from "./messageModel";

export interface IConversation extends Document {
  _id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: any[];
  admins: string[];
  adminOnly: boolean;
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: Date;
    messageType: "text" | "image" | "file";
  };
  lastMessageAt: Date;
  isActive: boolean;
  createdBy: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  tested: boolean;
}

// // // body for creating new conversation for groups will look like ------->>

// {
//   type: "group";
//   name: "";
//   avatar: ""; // // // Default Url :- https://res.cloudinary.com/dlvq8n2ca/image/upload/t_Rounded%204:3/v1756146327/xzp8tpeum1yhpvk5eie6.jpg
//   participants: ["", ""];
//   admins: [""]; // // // by default creator will be admin
//   createdBy: ""; // // // User id of creator of this group
// }

const ConversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ["direct", "group"], required: true },
    name: { type: String, trim: true, maxlength: 100 },
    avatar: { type: String, trim: true },
    participants: [
      { type: Schema.Types.ObjectId, ref: "users", required: true },
    ],
    admins: [{ type: Schema.Types.ObjectId, ref: "users" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    isActive: { type: Boolean, default: true },
    adminOnly: { type: Boolean, default: false },
    lastMessage: {
      content: String,
      sender: { type: Schema.Types.ObjectId, ref: "users" },
      timestamp: {
        type: Date,
        default: new Date(),
      },
      messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text",
      },
    },
    lastMessageAt: { type: Date, default: new Date() },
    description: { type: String, trim: true, default: "" },
    tested: {
      type: Boolean,
      default: true, // // // Default is true means no banned thing present meta data wise.
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

const ConversationModel: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
export default ConversationModel;
