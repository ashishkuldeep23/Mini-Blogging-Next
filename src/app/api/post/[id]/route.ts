
import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { isValidObjectId, model, modelNames, models } from "mongoose"




export async function GET(req: NextRequest, context: any) {

    await connect()

    // // // This is used to print all register models
    console.log(modelNames())


    try {

        let postId = context?.params?.id

        if (!postId) {
            return NextResponse.json({ success: false, message: 'Post is not given. or Not vaild' }, { status: 400 })
        }

        if (!isValidObjectId(postId)) {
            return NextResponse.json({ success: false, message: 'Given post id is invailid.' }, { status: 400 })
        }


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")

        // console.log(allComments)


        let findPost = await Post.findById(postId)
            .populate({
                path: "author",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -allProfilePic",
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
        // .exec()

        // console.log(JSON.stringify(findPost, null, 4))

        if (!findPost) {
            return NextResponse.json({ success: false, message: 'Post not found with given id.' }, { status: 404 })
        }

        if (findPost.isDeleted) {
            return NextResponse.json({ success: false, message: 'Post is deleted now.' }, { status: 400 })
        }


        // console.log(findPost)

        return NextResponse.json({ success: true, data: findPost, message: "New post created." }, { status: 200 })

        // return res.status(201).json({ success: true, data: [], message: "New post created." })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })

        // return res.status(500).json({ success: false, data: [], message: `${error.message} (Server Error)` })
    }
}


