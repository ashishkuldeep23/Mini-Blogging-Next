import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import Reply from "@/models/replyModel";

import { NextRequest, NextResponse } from "next/server";



connect()


export async function PUT(req: NextRequest, context: any) {

    try {


        let commentID = context?.params?.id

        if (!commentID) {
            return NextResponse.json({ success: false, message: 'comment Id is not given. or Not vaild' }, { status: 400 })
        }

        // console.log(context)
        // console.log(commentID)



        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { userId, commentId, replyId, index } = reqBody

        if (!userId || !commentId || !replyId || index === undefined) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }


        // // // Logic for update comment ------------> 

        let findComment = await Comment.findById(commentId)
        if (!findComment) return NextResponse.json({ success: false, message: 'No comment found with given post id.' }, { status: 404 })

        // console.log({ findComment })

        // // // Check reply present ----->


        let findReply = await Reply.findById(replyId)
        if (!findReply) return NextResponse.json({ success: false, message: 'No reply found with given post id.' }, { status: 404 })



        // // // // check commnet given by same user or not --->
        if (findReply.userId.toString() !== userId) return NextResponse.json({ success: false, message: 'Seem like reply is not given by you' }, { status: 403 })


        let updateReply = await Reply.findByIdAndDelete(findReply._id)


        // // // Here removing _id from comment of replies ---->
        let deleted = findComment.replies.splice(index, 1)

        // console.log({ deleted })
        await findComment.save()



        // console.log({ findComment })


        let updatedComment = await Comment.findById(commentId)
            .populate({
                path: "userId",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .populate({
                path: "likesId",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .populate({
                path: "replies",
                select: "-updatedAt -createdAt -__v  -postId ",
                populate: {
                    path: "userId",
                    // match: { isDeleted: false },
                    select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
                }
            })
            .select("-updatedAt -createdAt -__v ")



        // console.log({ updatedComment })


        return NextResponse.json(
            {
                success: true,
                data: updatedComment,
                message: "New comment created."
            },
            {
                status: 200
            }
        )

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}




