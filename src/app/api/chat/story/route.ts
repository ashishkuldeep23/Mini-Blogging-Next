import { connect } from "@/dbConfig/dbConfig";
import ChatStoryModel from "@/models/chatStoryModel";
import User from "@/models/userModel";
import { AppWindowMac } from "lucide-react";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// // // This will load all friend's chat stories to user.
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    // // console.log({ userId });/

    // get user + friends
    const user = await User.findById(userId).populate("friends");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const friendIds = user.friends.map((f: any) => f._id);

    // // console.log(friendIds);

    // fetch all friend stories
    const stories = await ChatStoryModel.find({
      author: { $in: [...friendIds, userId] },
      expiresAt: { $gt: new Date() }, // not expired
    })
      .populate("author", "_id username email profilePic")
      .populate("seenBy", "_id username email profilePic")
      .populate("likedBy", "_id username email profilePic");

    // console.log(JSON.stringify(stories, null, 2));

    return NextResponse.json(
      {
        success: true,
        data: stories,
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

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { userId, text } = await req.json();

    // // // validate user ---->>

    if (!userId || !text)
      return NextResponse.json(
        {
          success: false,
          message: "UserId or text is not given.",
        },
        { status: 400 }
      );

    if (!mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid UserId.",
        },
        { status: 400 }
      );
    }

    let checkUserData = await User.findById(userId);
    if (!checkUserData)
      return NextResponse.json(
        {
          success: false,
          message: "User not found with given id.",
        },
        { status: 404 }
      );

    // expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await ChatStoryModel.create({
      author: userId,
      text,
      expiresAt,
    });

    await story.populate("author", "_id username email profilePic");

    // await story.populate("seenBy", "_id username email profilePic");
    // await story.populate("likedBy", "_id username email profilePic");

    return NextResponse.json(
      {
        success: true,
        data: story,
        message: "Chat story created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, data: error, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get("storyId");

    if (!storyId) {
      return NextResponse.json(
        { success: false, message: "storyId required" },
        { status: 400 }
      );
    }

    const story = await ChatStoryModel.findById(storyId);
    if (!story) {
      return NextResponse.json(
        { success: false, message: "Story not found" },
        { status: 404 }
      );
    }

    await ChatStoryModel.findByIdAndDelete(storyId);

    return NextResponse.json(
      {
        success: true,
        data: story,
        message: "Story deleted successfully.",
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

export async function PUT(req: NextRequest) {
  try {
    await connect();

    const { userId, chatStoryId, seenUpdate, likeUpdate } = await req.json();

    if (!userId || !chatStoryId)
      return NextResponse.json(
        {
          success: false,
          message: "UserId or text is not given.",
        },
        { status: 400 }
      );

    if (!mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid UserId.",
        },
        { status: 400 }
      );
    }
    if (!mongoose.isValidObjectId(chatStoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Chat Story Id.",
        },
        { status: 400 }
      );
    }

    let checkUserData = await User.findById(userId);
    if (!checkUserData)
      return NextResponse.json(
        {
          success: false,
          message: "User not found with given id.",
        },
        { status: 404 }
      );

    let chatStoryData = await ChatStoryModel.findById(chatStoryId).populate(
      "author",
      "_id username email profilePic"
    );

    // .populate("seenBy", "_id username email profilePic")
    // .populate("likedBy", "_id username email profilePic");

    if (!chatStoryData)
      return NextResponse.json(
        {
          success: false,
          message: "User not found with given id.",
        },
        { status: 404 }
      );

    // // // Now upadate fields that you want to update ---------->>

    if (seenUpdate) {
      // chatStoryData.seenBy = [...chatStoryData.seenBy , userId ]
      if (chatStoryData.seenBy) {
        chatStoryData.seenBy.push(userId);

        // // // if already seen then tekal that also ------>>
      } else {
        chatStoryData.seenBy = [userId];
      }
    }

    if (likeUpdate) {
      // console.log(1);

      if (chatStoryData.likedBy) {
        // console.log(2);

        let checkLikedOrNot = chatStoryData?.likedBy?.findIndex(
          (u) => u?._id == userId
        );

        // console.log(chatStoryData?.likedBy);
        // console.log(checkLikedOrNot);

        if (checkLikedOrNot === -1) {
          // console.log(3);
          chatStoryData.likedBy.push(userId);
        } else {
          // console.log(chatStoryData.likedBy);

          chatStoryData.likedBy.splice(checkLikedOrNot, 1);
        }
      } else {
        chatStoryData.likedBy = [userId];
      }
    }

    let updatedChatStory = await chatStoryData.save();
    await updatedChatStory.populate("seenBy", "_id username email profilePic");
    await updatedChatStory.populate("likedBy", "_id username email profilePic");

    // console.log(JSON.stringify(updatedChatStory, null, 2));

    return NextResponse.json(
      {
        success: true,
        data: updatedChatStory,
        message: "Story updated now.",
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
