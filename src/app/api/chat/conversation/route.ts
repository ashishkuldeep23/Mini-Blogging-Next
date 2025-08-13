import { connect } from "@/dbConfig/dbConfig";
import ConversationModel from "@/models/conversationModel";
import User from "@/models/userModel";
import { modelNames } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromServer } from "../../getUserDataServer";

// // // Used to get all conversations
export async function GET() {
  await connect();

  console.log(modelNames());
  // // // Jsut getting for comment data avilable below.
  await User.findById("65ffbc7cf6215d659db3b197");

  try {
    let userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );
    }

    // // // Need to include pagination here ---------->>

    const conversations = await ConversationModel.find({
      participants: userData._id,
      isActive: true,
    })
      .populate("participants", " username email profilePic isOnline lastSeen")
      .populate(
        "lastMessage.sender",
        " username email profilePic isOnline lastSeen"
      )
      .sort({ lastMessageAt: -1 })
      .lean();

    // console.log({ conversations });

    const participantsUserIds = [] as any[];

    conversations.forEach((convo) => {
      convo?.participants?.forEach((user) => {
        participantsUserIds.push(user._id.toString());
      });

      // participantsUserIds.push(convo['participants._id']);
    });

    // console.log({ participantsUserIds: participantsUserIds.flat(Infinity) });
    // console.log({ a: userData.friends });

    const startConvoWithThese = [...userData.friends].filter(
      (id) => !participantsUserIds.flat(Infinity).includes(id.toString())
    );

    // console.log({ startConvoWithThese });

    // // // Now we can populate the participants arr with user data -------->>

    // // // Here getting users to start convo ------>>
    let startConvoUserData = await User.find({
      _id: { $in: startConvoWithThese },
    }).select(" _id email username profilePic friends lastSeen isOnline bio ");

    // console.log({ startConvoUserData });

    return NextResponse.json(
      {
        success: true,
        data: conversations,
        startConvo: startConvoUserData,
        userId: userData._id,
        message: "Conversation data fetched.",
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

export async function POST(req: NextRequest) {
  await connect();
  console.log(modelNames());
  // // // Jsut getting for comment data avilable below.
  await User.findById("65ffbc7cf6215d659db3b197");

  try {
    const reqBody = await req.json();

    // console.log("session", session);

    let userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );
    }

    // // // Now create logic for creating new convo.

    // // // Chcek both are friends ----------------->>(latter)

    const friendUserId = reqBody.friendUserId;

    if (!friendUserId)
      return NextResponse.json(
        { success: false, message: "Friend's Id is not given" },
        { status: 404 }
      );

    const checkConversation = await ConversationModel.findOne({
      type: "direct",
      participants: {
        $all: [userData._id, friendUserId],
        $size: 2,
      },
    });

    let conversation;

    if (!checkConversation) {
      conversation = await ConversationModel.create({
        type: "direct",
        participants: [userData._id, friendUserId],
        createdBy: userData._id, // Person who accepted
        lastMessageAt: new Date(),
      });

      await conversation.populate(
        "participants",
        " username email profilePic isOnline lastSeen"
      );
    }

    // console.log(conversation || checkConversation);

    return NextResponse.json(
      {
        success: true,
        data: conversation || checkConversation,
        message: "Conversation created.",
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
