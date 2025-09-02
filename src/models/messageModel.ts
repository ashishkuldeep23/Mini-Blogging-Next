import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./userModel";
import conversationModel from "./conversationModel";
import chatStoryModel from "./chatStoryModel";

export interface IMessage extends Document {
  _id: string;
  conversationId: string | undefined;
  sender: (string | { _id: string }) | undefined;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  replyTo?: string;
  replyToChatStory?: string;
  readBy: { user: string; readAt: Date }[];
  reactions: { emoji: string; user: string }[];
  deletedBy: string[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  bannedWord: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversations",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true, maxlength: 5000 },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    readBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "users" },
        readAt: { type: Date, default: new Date() },
      },
    ],
    reactions: [
      {
        emoji: String,
        user: { type: Schema.Types.ObjectId, ref: "users" },
      },
    ],
    replyToChatStory: {
      type: Schema.Types.ObjectId,
      // ref: "chat_story",
      ref: "chat_stories",
    },
    isEdited: { type: Boolean, default: false },
    deletedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    isDeleted: { type: Boolean, default: false },
    bannedWord: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

const MessageModel: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export default MessageModel;
