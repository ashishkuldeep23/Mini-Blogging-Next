import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { modelNames } from "mongoose";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {

    await connect()

    // console.log(modelNames())
    // console.log("Called --------------->")

    try {


        let { hash, category, page, limit } = await req.json()

        // console.log({ hash, category, page, limit })

        // // // Pages and limits ---------->


        let pageNo = 1
        if (page) {
            pageNo = Number(page)
        }

        let limitOfProducts = 10;
        if (limit) {
            limitOfProducts = Number(limit)
        }


        // // // Now prepare searchObj for db ---->

        let searchObject: any = {
            isDeleted: false,
        }

        let searchByQuery = false

        // // // If getting posts by hash or category then limits should be 100 max.
        if (hash) {
            // searchObject.brand = brand.toLowerCase()
            searchObject.hashthats = { $regex: new RegExp(hash, 'i') }
            searchByQuery = true
            limitOfProducts = 100
        }

        if (category) {
            // searchObject.category = category.toLowerCase()
            searchObject.category = category
            searchByQuery = true
            limitOfProducts = 100
            // // // To lower case not used now
        }



        // // // Jsut want to ready user model befour populating (in below code ) (I wnat just my model should be model ready here) ---------->
        await User.findById("65ffbc7cf6215d659db3b197")


        // console.log("iktyutryetyr")

        let getAllPosts = await Post.find(searchObject)
            .sort({ "createdAt": "desc" })
            .limit(limitOfProducts * pageNo)
            .populate({
                path: "author",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -allProfilePic",
            })
            .select("-updatedAt -createdAt -__v ")

        // console.log(getAllPosts)


        if (getAllPosts.length <= 0) {
            NextResponse.json({ success: false, message: `Posts not found. | 404` }, { status: 404 })
        }



        let response = NextResponse.json({
            success: true,
            data: getAllPosts,
            searchByQuery,
            message: "All post fetched.",
        }, { status: 200 })

        response.headers.set("cache", "no-store")

        return response
        // response.setHeaders("" , "")



    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}


