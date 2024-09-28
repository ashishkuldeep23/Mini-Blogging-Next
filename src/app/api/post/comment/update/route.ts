import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";






export async function PUT(req: NextRequest) {

    connect()

    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { postId, userId, comment, commentId } = reqBody

        if (!postId || !userId || !comment || !commentId) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }


        // if(!author){
        //     return NextResponse.json({ success: false, message: 'Author id is not given.' }, { status: 404 })
        // }


        let findPost = await Post.findById(postId)

        if (!findPost) return NextResponse.json({ success: false, message: 'No post found with given post id.' }, { status: 404 })


        // console.log(findPost)

        // // // Logic for update comment ------------> 

        let findComment = await Comment.findById(commentId)
            .populate({
                path: "userId",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })

        if (!findComment) return NextResponse.json({ success: false, message: 'No comment found with given post id.' }, { status: 404 })


        // // // Check Given comment is same as previous ----->

        if (findComment.comment === comment) return NextResponse.json({ success: false, message: 'Please give different comment.' }, { status: 400 })


        // console.log(findComment.userId)
        // console.log(userId)

        // // // // check commnet given by same user or not --->
        if (findComment.userId._id.toString() !== userId) return NextResponse.json({ success: false, message: 'Seem like comment is not given by you' }, { status: 403 })






        // // // Now update comment here ----->

        findComment.comment = comment

        let updatedComment = await findComment.save()

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




