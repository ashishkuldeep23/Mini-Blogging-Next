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

        const { postId, userId } = reqBody

        if (!postId || !userId) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 404 })
        }



        /// // // find post and user data 

        let userData = await User.findById(userId)

        if (!userData) return NextResponse.json({ success: false, message: 'User not found. Please LogIn again.' }, { status: 404 })


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")


        let postData = await Post.findById(postId).select("-updatedAt -createdAt -__v ")

        if (!postData) return NextResponse.json({ success: false, message: 'Post not found. Please refresh page.' }, { status: 404 })


        // // // Now written logic for likes and dislike ------>
        // // // postData.likesId should be string[] (user_ids of arr) for logic 

        if (!postData.likesId.includes(userId)) {
            postData.likes = postData.likes + 1
            postData.likesId.unshift(userId)
        } else {

            // console.log(postData)
            // console.log(userId)

            let findIndex = postData.likesId.findIndex((ele: any) => ele.toString() === userId.toString())

            // console.log(findIndex)

            postData.likesId.splice(findIndex, 1)
            postData.likes = postData.likes - 1
        }

        // // // Save post here -------->
        await postData.save()


        let updatedPostData = await Post.findById(postId)
            .populate({
                path: "author",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .populate({
                path: "likesId",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .populate({
                path: "comments",
                select: "-updatedAt -createdAt -__v  -postId ",
                populate: {
                    path: "userId",
                    // match: { isDeleted: false },
                    select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
                }
            })
            .select("-updatedAt -createdAt -__v ")

        // console.log(updatedPostData)


        return NextResponse.json({ success: true, data: updatedPostData, message: "Like done." }, { status: 200 })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}