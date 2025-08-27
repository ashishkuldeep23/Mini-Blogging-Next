import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import Reply from "@/models/replyModel";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromServer } from "@/app/api/getUserDataServer";

export async function PUT(req: NextRequest) {
  await connect();

  try {
    // console.log("fsdfsdfsdfsdfsfd")

    const reqBody = await req.json();

    // console.log(reqBody)

    const { postId, userId, commentId } = reqBody;

    if (!postId || !userId || !commentId) {
      return NextResponse.json(
        { success: false, message: "Mandatory fields not given." },
        { status: 400 }
      );
    }

    // if(!author){
    //     return NextResponse.json({ success: false, message: 'Author id is not given.' }, { status: 404 })
    // }

    let findPost = await Post.findById(postId);

    if (!findPost)
      return NextResponse.json(
        { success: false, message: "No post found with given post id." },
        { status: 404 }
      );

    // console.log(findPost)

    // // // Logic for update comment ------------>

    let findComment = await Comment.findById(commentId);

    if (!findComment)
      return NextResponse.json(
        { success: false, message: "No comment found with given post id." },
        { status: 404 }
      );

    // // // // check commnet given by same user or not --->
    if (findComment.userId.toString() !== userId)
      return NextResponse.json(
        { success: false, message: "Seem like comment is not given by you" },
        { status: 403 }
      );

    let updatedComment = await Comment.findByIdAndDelete(findComment._id);

    // console.log(updatedComment)

    // // // now remove comment id from post of comments ---->
    let index = findPost.comments.findIndex(
      (ele: any) => ele._id === updatedComment._id
    );

    // // // Now update post of comments ---->
    findPost.comments.splice(index, 1);
    // findPost.rank = (findPost?.rank || 0) - 2;

    const loggedUserData = await getUserDataFromServer();

    if (
      loggedUserData &&
      loggedUserData?._id.toString() !== userId.toString()
    ) {
      findPost.rank = (findPost?.rank || 0) - 2;
    }

    await findPost.save();

    // // // Now delete all replies for this comment (working so fantastic as expected) ------->
    await Reply.deleteMany({ commentId: updatedComment._id });
    // console.log(deled)

    return NextResponse.json(
      {
        success: true,
        data: updatedComment,
        message: "New comment created.",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
}
