import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";


connect()


export async function POST(req: NextRequest) {

    // console.log("Called --------------->")

    try {

        // console.log("iktyutryetyr")

        let getAllPosts = await Post.find({ isDeleted: false })
            .sort({ "createdAt": "desc" })
            .populate({
                path: "author",
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .select("-updatedAt -createdAt -__v ")
            .exec()


        // console.log(getAllPosts)


        if (getAllPosts.length <= 0) {
            NextResponse.json({ success: false, message: `Posts not found. | 404` }, { status: 404 })
        }



        // console.log({ getAllPosts })

        // let cat = new Set([...getAllPosts.map((ele: any) => ele.category)])

        // console.log(cat)


        let postCategories = [...new Set(getAllPosts.map((ele: any) => ele.category))]

        let allHashs = getAllPosts.map((ele: any) => ele.hashthats)

        let posthashtags = [...new Set(allHashs.flat())]
        // console.log({ allHashs })

        let allPostsLength = getAllPosts.length


        let data = {
            postCategories,
            posthashtags,
            allPostsLength
        }


        let response = NextResponse.json({ success: true, data: data, message: "All post fetched." }, { status: 200 })

        response.headers.set("cache", "no-store")

        return response
        // response.setHeaders("" , "")



    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}



``