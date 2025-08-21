import { connect } from "@/dbConfig/dbConfig";
import ConversationModel from "@/models/conversationModel";
import MessageModel from "@/models/messageModel";
import { isValidObjectId, modelNames } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromServer } from "../../getUserDataServer";
import { pusherServer } from "@/lib/pusherServer";
import User from "@/models/userModel";

// // // I'll create new msg for convo ------------>
export async function POST(req: NextRequest) {
  await connect();
  console.log(modelNames());

  await MessageModel.findById("689e35e96fad307ce0d06faf");

  try {
    const reqBody = await req.json();

    // // // replyTo , readBy ,reactions ,  these are we'll use it later for PUT request ---------->>
    const { conversationId, sender, content, messageType, replyTo, readBy } =
      reqBody;

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
        { success: false, message: "Given id's is invailid." },
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

    // // // if sender is not part of participants then err msg
    if (!getConvoData?.participants?.includes(sender)) {
      return NextResponse.json(
        { success: false, message: "Sender is not part of conversation." },
        { status: 404 }
      );
    }

    const newMessage = await MessageModel.create({
      conversationId,
      sender,
      content,
      messageType,
      replyTo,
      readBy: [
        {
          user: userData._id,
          readAt: new Date(),
        },
      ],
    });

    await newMessage.populate("sender", " _id name username avatar");
    await newMessage.populate("replyTo", "content sender");

    // // // now send pusher msg here ----->>

    // const updateState = sender.toString() !== userData?._id.toString();

    // // //  Trigger the message to all participants
    // // // This is working so fine ------->>
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      "new-message",
      {
        ...newMessage.toObject(),
        // updateState,
      }
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
    const limit = searchParams.get("limit") || 10;

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
      deletedFor: { $nin: [userId] },
    });

    const skip = (Number(page) - 1) * Number(limit);

    // // // Now checking asking page is comes in total pages or not ---->

    const messages = await MessageModel.find({
      conversationId,
      isDeleted: false,
      deletedFor: { $nin: [userId] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("sender", "name username avatar")
      .populate("replyTo", "content sender")
      .populate("reactions.user", " _id username email profilePic ")
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
          totalPages: Math.ceil(total / Number(limit)),
          total,
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

// // // I'll create new msg for convo ------------>
export async function PUT(req: NextRequest) {
  await connect();
  console.log(modelNames());

  await MessageModel.findById("689e35e96fad307ce0d06faf");

  try {
    const reqBody = await req.json();

    // // // replyTo , readBy ,reactions ,  these are we'll use it later for PUT request ---------->>
    const {
      isUpdating = false,
      isEditted = false,
      // isReplyed = false,
      text,
      // replyTo,
      reaction,
      delReaction = false,
      message,
      isDeleting = false,
      isDeletingForMe = false,
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
    if (!isUpdating || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // // // Check convoId is mongoid or not
    if (!isValidObjectId(message?._id)) {
      return NextResponse.json(
        { success: false, message: "Given Msg id is invailid." },
        { status: 400 }
      );
    }

    // // // Check convoId is mongoid or not
    if (!isValidObjectId(message?.conversationId)) {
      return NextResponse.json(
        { success: false, message: "Given Msg id is invailid." },
        { status: 400 }
      );
    }

    // // // Validation of conversation data ----------->>
    const convoData = await ConversationModel.findById(message?.conversationId)
      .populate(
        "participants",
        " _id username email profilePic isOnline lastSeen"
      )
      .populate("admins", " _id username email profilePic isOnline lastSeen");

    if (!convoData) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found. It may be deleted.",
        },
        { status: 404 }
      );
    }
    let getMsgData = await MessageModel.findById(message?._id)
      .populate("sender", " _id name username avatar")
      .populate("replyTo", " _id content sender");

    if (!getMsgData) {
      return NextResponse.json(
        { success: false, message: "Given Msg id is invailid." },
        { status: 404 }
      );
    }

    // // // Edit message --------->>
    // console.log({ getMsgData });
    // console.log({ reqBody });

    // // // Now start updating message --------->>

    if (isEditted) {
      // console.log("yesss");

      // // // this is used for isEdited only --------->>
      // let senderId = getMsgData?.sender._id!;
      let senderId =
        typeof getMsgData?.sender === "string"
          ? getMsgData?.sender
          : getMsgData?.sender?._id;

      if (
        senderId &&
        isValidObjectId(senderId) &&
        userData._id.toString() !== senderId.toString()
      ) {
        return NextResponse.json(
          { success: false, message: "Access denied." },
          { status: 400 }
        );
      }

      getMsgData.content = text;
      getMsgData.isEdited = true;

      // console.log("yesss2");
    }

    // // // For Reaction -------->>
    if (reaction && reaction?.emoji && reaction?.user) {
      // // // Server validation
      if (!isValidObjectId(reaction?.user)) {
        return NextResponse.json(
          { success: false, message: "Given user id is invailid." },
          { status: 400 }
        );
      }

      let chcekUserId = await User.findById(reaction?.user).select(
        " _id username email profilePic "
      );

      if (!chcekUserId) {
        return NextResponse.json(
          { success: false, message: "Given user id is invailid." },
          { status: 400 }
        );
      }

      // // // check user is already reacted or not
      const isUserReactedIndex = getMsgData.reactions.findIndex((r) => {
        return r.user.toString() === reaction.user.toString();
      });

      const index =
        isUserReactedIndex === -1
          ? getMsgData.reactions.length
          : isUserReactedIndex;

      const delCount = isUserReactedIndex === -1 ? 0 : 1;

      if (!delReaction) {
        // // // Adding and updating reaction --------->>

        getMsgData.reactions.splice(index, delCount, {
          emoji: reaction.emoji,
          user: reaction.user,
        });
      } else {
        // // // Deleting the reaction --------->>
        getMsgData.reactions.splice(index, delCount);
      }

      // // // now give a event for animation via pusher --------->>

      // getMsgData.reactions.push({
      //   emoji: reaction.emoji,
      //   user: reaction.user,
      // });

      // console.log(userData?._id?.toString());
      // console.log(chcekUserId?._id.toString());
      // console.log(message?.sender?._id.toString());

      // // // Now send a pusher event --------->>
      !delReaction &&
        (await pusherServer.trigger(
          `private-conversation-${convoData._id}`,
          "reacted-emoji",
          {
            isShowEmoji:
              userData?._id?.toString() !== chcekUserId?._id.toString(),
            reactedemoji: reaction.emoji,
            reactedUser: chcekUserId,
            // ...message,
          }
        ));
    }

    // // // For Delete -------->>
    // // Main Delete ----------->>
    if (isDeleting) {
      let senderId =
        typeof getMsgData?.sender === "string"
          ? getMsgData?.sender
          : getMsgData?.sender?._id;

      // console.log(senderId?.toString());
      // console.log(userData._id?.toString());
      // console.log(senderId && userData._id.toString() !== senderId.toString());
      // console.log(!convoData.admins.includes(userData._id));

      if (
        senderId &&
        isValidObjectId(senderId) &&
        (userData._id.toString() !== senderId.toString() ||
          (convoData?.admins?.length &&
            !convoData?.admins?.includes(userData._id)))
      ) {
        return NextResponse.json(
          { success: false, message: "Access denied." },
          { status: 400 }
        );
      }

      getMsgData.deletedBy.push(userData._id);
      getMsgData.isDeleted = true;
    }

    if (isDeletingForMe) {
      getMsgData.deletedBy.push(userData._id);
    }

    // // // Now save the message --------->>
    await getMsgData.save();

    await getMsgData.populate(
      "reactions.user",
      "_id username email profilePic isOnline lastSeen"
    );

    // // // Now here write deleting log (both deleted for users and actual del fn) --------->>

    // // //  Trigger the message to all participants
    // // // This is working so fine ------->>

    // let obj = getMsgData.toObject();

    // let msgDataObj = {
    //   ...obj,
    //   reactions: obj?.reactions?.reverse(),
    // };
    let msgDataObj = getMsgData.toObject();

    await pusherServer.trigger(
      `private-conversation-${convoData._id}`,
      "put-message",
      msgDataObj
    );
    // .populate("participants", "username email profilePic isOnline lastSeen");

    return NextResponse.json(
      {
        success: true,
        data: msgDataObj,
        conversationId: convoData._id,
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
