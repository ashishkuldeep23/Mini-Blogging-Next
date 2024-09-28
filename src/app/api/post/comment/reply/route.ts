import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import Reply from "@/models/replyModel";
import { NextRequest, NextResponse } from "next/server";





export async function POST(req: NextRequest) {

    await  connect()

    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { userId, commentId, reply } = reqBody

        if (!userId || !commentId || !reply) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }


        // if(!author){
        //     return NextResponse.json({ success: false, message: 'Author id is not given.' }, { status: 404 })
        // }


        // // // find comment by given commentId

        let findComment = await Comment.findById(commentId)

        if (!findComment) return NextResponse.json({ success: false, message: 'No Comment found with given post id.' }, { status: 404 })


        // console.log(findPost)


        let createReply = new Reply(reqBody)

        createReply = await createReply.save()

        // findPost.comments.unshift(createComment._id)

        // findPost = await findPost.save()

        findComment.replies.unshift(createReply._id)

        findComment = await findComment.save()


        // console.log(findPost)


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")
        await Reply.findById("660cba65c543855317a68f02")


        // return NextResponse.json({ success: true, data: createNewPost, message: "User created." }, { status: 201 })


        let getUpdatedComment = await Comment.findById(findComment._id)
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




        return NextResponse.json(
            {
                success: true,
                data: getUpdatedComment,
                message: "New comment created."
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




