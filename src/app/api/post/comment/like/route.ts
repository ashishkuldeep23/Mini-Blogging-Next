import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";



connect()


export async function PUT(req: NextRequest) {

    try {



        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { postId, userId, commentId } = reqBody

        if (!postId || !userId || !commentId) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 404 })
        }



        /// // // find post and user data 

        let userData = await User.findById(userId)

        if (!userData) return NextResponse.json({ success: false, message: 'User not found. Please LogIn again.' }, { status: 404 })


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")


        let findComment = await Comment.findById(commentId)
            .populate({
                path: "userId",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .select("-updatedAt -createdAt -__v ")

        if (!findComment) return NextResponse.json({ success: false, message: 'Post not found. Please refresh page.' }, { status: 404 })



        // // // Comment by ------>
        // // // // check commnet given by same user or not --->
        if (findComment.userId._id.toString() !== userId) return NextResponse.json({ success: false, message: 'Seem like comment is not given by you' }, { status: 403 })




        // // // Now written logic for likes ------>

        if (!findComment.likesId.includes(userId)) {
            findComment.likes = findComment.likes + 1
            findComment.likesId.push(userId)
        } else {

            // console.log(postData)
            // console.log(userId)

            let findIndex = findComment.likesId.findIndex((ele: any) => ele.toString() === userId.toString())

            // console.log(findIndex)

            findComment.likesId.splice(findIndex, 1)


            findComment.likes = findComment.likes - 1

        }


        let updatedCommentData = await findComment.save()

        // console.log(updatedPostData)


        return NextResponse.json({ success: true, data: updatedCommentData, message: "Like done." }, { status: 200 })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}