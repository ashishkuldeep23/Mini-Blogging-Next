import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStory extends Document {
  author: mongoose.Types.ObjectId;
  text: string; // image/video
  expiresAt: Date;
  seenBy: mongoose.Types.ObjectId[];
  likedBy: mongoose.Types.ObjectId[];
}

const ChatStorySchema = new Schema<IStory>(
  {
    author: { type: Schema.Types.ObjectId, ref: "users", required: true },
    text: { type: String, required: true },
    expiresAt: { type: Date, required: true }, // e.g. 24h from creation
    seenBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

// Optional index to auto-remove expired stories
ChatStorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// export default mongoose.models.ChatStoryModel ||
//   mongoose.model<IStory>("chat_story", ChatStorySchema);

const ChatStoryModel: Model<IStory> =
  mongoose.models.chat_story ||
  mongoose.model<IStory>("chat_story", ChatStorySchema);
export default ChatStoryModel;
