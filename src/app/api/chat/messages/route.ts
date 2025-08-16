import { connect } from "@/dbConfig/dbConfig";
import ConversationModel from "@/models/conversationModel";
import MessageModel from "@/models/messageModel";
import { isValidObjectId, modelNames } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromServer } from "../../getUserDataServer";
import { pusherServer } from "@/lib/pusherServer";

// // // I'll create new msg for convo ------------>
export async function POST(req: NextRequest) {
  await connect();
  console.log(modelNames());

  await MessageModel.findById("689e35e96fad307ce0d06faf");

  try {
    const reqBody = await req.json();

    // // // replyTo , readBy ,reactions ,  these are we'll use it later for PUT request ---------->>
    const {
      conversationId,
      sender,
      content,
      messageType,
      replyTo,
      readBy,
      reactions,
    } = reqBody;

    // console.log(reqBody);

    const userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );
    }

    // // // Server validation
    if (!conversationId || !sender || !content || !messageType) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // // // Check convoId is mongoid or not
    if (!isValidObjectId(conversationId) || !isValidObjectId(sender)) {
      return NextResponse.json(
        { success: false, message: "Given id is invailid." },
        { status: 400 }
      );
    }

    // // // If content and msgType is not str then err msg
    if (typeof content !== "string" || typeof messageType !== "string") {
      return NextResponse.json(
        { success: false, message: "Content and msgType should be string" },
        { status: 400 }
      );
    }

    const getConvoData = await ConversationModel.findById(conversationId);

    if (!getConvoData)
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );

    const newMessage = await MessageModel.create({
      conversationId,
      sender,
      content,
      messageType,
      //   replyTo,
    });

    await newMessage.populate("sender", "name username avatar");
    await newMessage.populate("replyTo", "content sender");

    // // // now send pusher msg here ----->>

    // // //  Trigger the message to all participants
    // // // This is working so fine ------->>
    let a = await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      "new-message",
      {
        ...newMessage.toObject(),
      }
      // {
      //   _id: newMessage.id,
      //   conversationId,
      //   content,
      //   messageType,
      //   createdAt: newMessage.createdAt,
      //   sender: newMessage.sender,
      //   replyTo: newMessage.replyTo,
      // }
    );

    // console.log({ a });

    // await ConversationModel.findOneAndUpdate(
    //   { _id: conversationId, "participants._id": sender },
    //   { $push: { messages: { sender, content, messageType, replyTo } } },
    //   { new: true }
    // ).populate("participants", "username email profilePic isOnline lastSeen");

    // await ConversationModel.findOneAndUpdate(
    //   { _id: conversationId },
    //   { lastMessage: newMessage._id, lastMessageAt: new Date() }
    //   //   { new: true }
    // );
    // .populate("participants", "username email profilePic isOnline lastSeen");

    await ConversationModel.findOneAndUpdate(
      { _id: conversationId },
      {
        lastMessage: { sender, content, messageType },
        lastMessageAt: new Date(),
      }
      //   { new: true }
    );
    // .populate("participants", "username email profilePic isOnline lastSeen");

    return NextResponse.json(
      {
        success: true,
        data: newMessage,
        conversationId,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.log(e);

    return NextResponse.json(
      { success: false, message: `${e?.message} (Server Error)` },
      { status: 500 }
    );
  }
}

// // // I'll laod all msgs of a convo ---------->>
export async function GET(req: NextRequest) {
  await connect();
  console.log(modelNames());

  try {
    const userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );
    }

    const userId = userData._id;

    const { searchParams } = new URL(req.url);

    const conversationId = searchParams.get("conversationId");
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 50;

    // // // Type validation here ------->>

    console.log({ conversationId, page, limit });

    if (!isValidObjectId(conversationId)) {
      return NextResponse.json(
        { success: false, message: "Given id is invailid." },
        { status: 400 }
      );
    }

    // Verify user is participant in conversation
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 400 }
      );
    }

    const total = await MessageModel.countDocuments({
      conversationId,
      isDeleted: false,
      deletedFor: { $ne: userId },
    });

    const skip = (Number(page) - 1) * Number(limit);

    // // // Now checking asking page is comes in total pages or not ---->

    const messages = await MessageModel.find({
      conversationId,
      isDeleted: false,
      deletedFor: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("sender", "name username avatar")
      .populate("replyTo", "content sender")
      .lean();

    // Reverse to get chronological order
    messages.reverse();

    return NextResponse.json(
      {
        success: true,
        data: messages,
        total,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: `${e?.message} (Server Error)` },
      { status: 500 }
    );
  }
}
