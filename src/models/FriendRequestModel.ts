import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFriendRequest extends Document {
  _id: string;
  sender: string | undefined;
  receiver: string | undefined;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    message: { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FriendRequest: Model<IFriendRequest> =
  mongoose.models.FriendRequest ||
  mongoose.model<IFriendRequest>("FriendRequest", FriendRequestSchema);
export default FriendRequest;
