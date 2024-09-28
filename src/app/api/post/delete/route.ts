import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req: NextRequest) {

    connect()

    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { postId, userId } = reqBody

        if (!postId || !userId) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }

        let findPost = await Post.findById(postId)

        if (!findPost) return NextResponse.json({ success: false, message: 'No post found with given post id.' }, { status: 404 })

        if (findPost.isDeleted) return NextResponse.json({ success: false, message: 'Post is aleady deleted.' }, { status: 404 })


        if (findPost.author.toString() !== userId) return NextResponse.json({ success: false, message: 'Post is not given by you.' }, { status: 400 })



        // // // Now delete post --------->
        findPost.isDeleted = true
        let updatedPost = await findPost.save()

        // console.log(updatedPost)


        return NextResponse.json(
            {
                success: true,
                data: updatedPost,
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




