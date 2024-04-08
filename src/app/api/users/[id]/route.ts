
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { isValidObjectId, model, modelNames, models } from "mongoose"

// import { getServerSession } from "next-auth/next"
// import { NextApiRequest } from "next";



export async function GET(req: NextRequest, context: any) {

    connect()


    // // // This is used to print all register models
    console.log(modelNames())


    try {

        let userId = context?.params?.id

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Post is not given. or Not vaild' }, { status: 400 })
        }

        if (!isValidObjectId(userId)) {
            return NextResponse.json({ success: false, message: 'Given post id is invailid.' }, { status: 400 })
        }


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")

        // console.log(allComments)



        let user = await User.findById(userId)
            .select("-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password")



        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found with given id.' }, { status: 404 })
        }



        let posts = await Post.find({ author: userId, isDeleted: false })
            .populate({
                path: "author",
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

        if (posts.length <= 0) {
            return NextResponse.json({ success: false, message: 'Seem like you haved created any post.' }, { status: 404 })
        }




        // console.log(findPost)

        return NextResponse.json({ success: true, data: { user, posts }, message: "New post created." }, { status: 200 })

        // return res.status(201).json({ success: true, data: [], message: "New post created." })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })

        // return res.status(500).json({ success: false, data: [], message: `${error.message} (Server Error)` })
    }
}


