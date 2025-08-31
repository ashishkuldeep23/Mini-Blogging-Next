import { connect } from "@/dbConfig/dbConfig";
import ChatStoryModel from "@/models/chatStoryModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
    }).populate("author", "_id username email profilePic");

    // // console.log(stories);

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

export async function POST(req: Request) {
  try {
    await connect();

    const { userId, text } = await req.json();

    // expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await ChatStoryModel.create({
      author: userId,
      text,
      expiresAt,
    });

    await story.populate("author", "_id username email profilePic");

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

export async function DELETE(req: Request) {
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
