import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {


    connect()


    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { title, category, promptReturn, author, postId } = reqBody

        if (!title || !category || !promptReturn) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }

        if (!author) {
            return NextResponse.json({ success: false, message: 'Author id is not given.' }, { status: 400 })
        }


        let findPost = await Post.findById(postId)

        if (!findPost) return NextResponse.json({ success: false, message: 'No post found with given post id.' }, { status: 404 })

        if (findPost.isDeleted) return NextResponse.json({ success: false, message: 'Post is aleady deleted.' }, { status: 404 })

        // // // Authorisation here --------->>
        if (findPost.author.toString() !== author) return NextResponse.json({ success: false, message: 'Post is not given by you.' }, { status: 400 })




        let updatedPost = await Post.findByIdAndUpdate(
            postId,
            reqBody,
            {
                new: true,
                upsert: true

            }
        )
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
        // .exec()


        // let createNewPost = new Post(reqBody)

        // createNewPost = await createNewPost.save()

        // // return NextResponse.json({ success: true, data: createNewPost, message: "User created." }, { status: 201 })


        return NextResponse.json({ success: true, data: updatedPost, message: "Post updated successfully." }, { status: 201 })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}
