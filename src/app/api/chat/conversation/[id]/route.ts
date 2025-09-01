import { getUserDataFromServer } from "@/app/api/getUserDataServer";
import { connect } from "@/dbConfig/dbConfig";
import ConversationModel from "@/models/conversationModel";
import MessageModel from "@/models/messageModel";
import { isValidObjectId, modelNames } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// // // This is used to get conversation data, when user press on a conversation on ui.
export async function GET(req: NextRequest, context: any) {
  await connect();
  console.log(modelNames());
  await MessageModel.findById("689e35e96fad307ce0d06faf");

  try {
    let convoId = context?.params?.id;

    // console.log(convoId);

    if (!convoId) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation Id is not given. or Not vaild",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(convoId)) {
      return NextResponse.json(
        { success: false, message: "Given post id is invailid." },
        { status: 400 }
      );
    }

    const convoData = await ConversationModel.findById(convoId)
      .populate("participants", " username email profilePic isOnline lastSeen")
      .populate(
        "lastMessage.sender",
        " username email profilePic isOnline lastSeen"
      )
      .populate("admins", "username email profilePic isOnline lastSeen")
      .sort({ lastMessageAt: -1 })
      .lean();

    if (!convoData) {
      return NextResponse.json(
        { success: false, message: "Conversation not found with given id." },
        { status: 404 }
      );
    }

    if (!convoData.isActive) {
      return NextResponse.json(
        { success: false, message: "Conversation is deleted now." },
        { status: 400 }
      );
    }

    let userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );
    }

    let friendsData =
      convoData.type === "direct" &&
      convoData.participants.find(
        (user: any) => user._id.toString() !== userData._id.toString()
      );

    // // // now find last two msgs also -------->>

    const findMessages = await MessageModel.find({ conversationId: convoId })
      .populate("sender", "name username avatar")
      .populate("replyTo", "content sender")
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    // Reverse to get chronological order
    findMessages.reverse();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...convoData,
          name: friendsData?.username || convoData?.name,
          avatar: friendsData?.profilePic || convoData?.avatar,
        },
        convoId: convoId,
        messageArr: findMessages,
        message: "Conversation data fetched.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );

    // return res.status(500).json({ success: false, data: [], message: `${error.message} (Server Error)` })
  }
}
