import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  _id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: string[];
  admins: string[];
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
}

const ConversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ["direct", "group"], required: true },
    name: { type: String, trim: true, maxlength: 100 },
    avatar: { type: String, default: "" },
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      content: String,
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: Date,
      messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text",
      },
    },
    lastMessageAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

const ConversationModel: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
export default ConversationModel;
