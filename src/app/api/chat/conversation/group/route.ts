import { getUserDataFromServer } from "@/app/api/getUserDataServer";
import { connect } from "@/dbConfig/dbConfig";
import ConversationModel from "@/models/conversationModel";
import User from "@/models/userModel";
import { modelNames } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();
  console.log(modelNames());
  // // // Jsut getting for comment data avilable below.
  await User.findById("65ffbc7cf6215d659db3b197");

  try {
    const reqBody = await req.json();
    
    let userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );
    }

    const {
      name,
      avatar,
      participants,
      admins,
      adminOnly,
      description,
      tested,
    } = reqBody;

    let conversation = await ConversationModel.create({
      type: "group",
      name: name,
      avatar: avatar,
      participants: [userData._id, ...participants],
      admins: [userData._id, ...admins],
      createdBy: userData._id, // Person who accepted
      lastMessageAt: new Date(),
      adminOnly: adminOnly,
      description: description,
      tested: tested,
    });

    await conversation.populate(
      "participants",
      " username email profilePic isOnline lastSeen"
    );

    // console.log(conversation || checkConversation);

    return NextResponse.json(
      {
        success: true,
        data: conversation,
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
