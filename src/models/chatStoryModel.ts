import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStory extends Document {
  seenBy: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  likedBy: mongoose.Types.ObjectId;
  text: string; // image/video
  expiresAt: Date;
}

const ChatStorySchema = new Schema<IStory>(
  {
    author: { type: Schema.Types.ObjectId, ref: "users", required: true },
    seenBy: { type: Schema.Types.ObjectId, ref: "users" },
    likedBy: { type: Schema.Types.ObjectId, ref: "users" },
    text: { type: String, required: true },
    expiresAt: { type: Date, required: true }, // e.g. 24h from creation
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
