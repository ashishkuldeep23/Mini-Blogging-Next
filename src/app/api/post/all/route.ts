import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";


connect()


export async function POST(req: NextRequest) {

    console.log("Called --------------->")

    try {

        // console.log("iktyutryetyr")

        let getAllPosts = await Post.find({ isDeleted: false })
            .sort({ "createdAt": "desc" })
            // .sort({ 
            //     createdAt: "-1"
            // })
            // .sort(["desc"])
            .populate({
                path: "author",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .select("-updatedAt -createdAt -__v ")


        // console.log(getAllPosts)


        if (getAllPosts.length <= 0) {
            NextResponse.json({ success: false, message: `Posts not found. | 404` }, { status: 404 })
        }



        let response = NextResponse.json({ success: true, data: getAllPosts, message: "All post fetched." }, { status: 200 })

        response.headers.set("cache", "no-store")

        return response
        // response.setHeaders("" , "")



    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}



