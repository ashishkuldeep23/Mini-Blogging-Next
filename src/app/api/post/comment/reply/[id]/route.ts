import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import Reply from "@/models/replyModel";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest, context: any) {


    connect()

    try {


        let commentId = context?.params?.id

        if (!commentId) {
            return NextResponse.json({ success: false, message: 'comment Id is not given. or Not vaild' }, { status: 400 })
        }


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")
        await Reply.findById("660cba65c543855317a68f02")


        // return NextResponse.json({ success: true, data: createNewPost, message: "User created." }, { status: 201 })


        let getUpdatedComment = await Comment.findById(commentId)
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




        return NextResponse.json(
            {
                success: true,
                data: getUpdatedComment,
                message: "Reply data fetched."
            },
            {
                status: 201
            }
        )
    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}



