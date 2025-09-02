import { connect } from "@/dbConfig/dbConfig";
import ChatStoryModel from "@/models/chatStoryModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// // // This will give all data about one story called with id. ----->>
export async function GET(req: NextRequest, context: any) {
  try {
    await connect();

    // const { searchParams } = new URL(req.url);
    // const userId = searchParams.get("userId");

    let chatStoryId = context?.params?.id;

    if (!chatStoryId)
      return NextResponse.json(
        { success: false, message: "chatStoryId required" },
        { status: 400 }
      );

    if (!mongoose.isValidObjectId(chatStoryId))
      return NextResponse.json(
        { success: false, message: "Invalid chatStoryId" },
        { status: 400 }
      );


    // fetch all friend stories
    const storyData = await ChatStoryModel.findById(chatStoryId)
      .populate("author", "_id username email profilePic")
      .populate("seenBy", "_id username email profilePic")
      .populate("likedBy", "_id username email profilePic");

    // console.log(JSON.stringify(stories, null, 2));

    return NextResponse.json(
      {
        success: true,
        data: storyData,
        message: "Stories fetched successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, data: error, message: "Server Error" },
      { status: 500 }
    );
  }
}
