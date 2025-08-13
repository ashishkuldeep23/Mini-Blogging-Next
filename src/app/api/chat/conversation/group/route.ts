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

    // const friendUserId = reqBody.friendUserId;

    // if (!friendUserId)
    //   return NextResponse.json(
    //     { success: false, message: "Friend's Id is not given" },
    //     { status: 404 }
    //   );

    // // // Body data
    // // participants will be array of user ids.
    // // admins will be array of user ids.
    const { name, avatar , participants , admins } = reqBody;

    let conversation = await ConversationModel.create({
      type: "group",
      name: name,
      avatar: avatar,
      participants: participants,
      admins: admins,
      createdBy: userData._id, // Person who accepted
      lastMessageAt: new Date(),
    });

    await conversation.populate(
      "participants",
      " username email profilePic isOnline lastSeen"
    );

    // console.log(conversation || checkConversation);

    return NextResponse.json(
      {
        success: true,
        data: conversation ,
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
