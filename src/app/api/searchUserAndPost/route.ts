import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {


    await  connect()


    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        console.log(reqBody)

        const { key, type } = reqBody



        if (!key || !type) return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })


        if (type && type !== "soft" && type !== "hard") return NextResponse.json({ success: false, message: 'Invalid type for search.' }, { status: 400 })

        // console.log("Check point clear ---------->")



        let option = 'i'          // // // This option used in regex to find data

        let getPostsFromDB = await Post.find({
            $or: [
                { title: { $regex: key, $options: option } }, // case-insensitive
                { category: { $regex: key, $options: option } },
                { hashthats: { $regex: `#${key}`, $options: option } }
            ],
            isDeleted: false     // // // Give not deleted products only 
        })
            .populate({
                path: "author",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .sort({ "updatedAt": "desc" })
            .limit(type === "soft" ? 0 : 100000)




        let getUsersFromDB = await User.find({
            $or: [
                { username: { $regex: key, $options: option } }, // case-insensitive
                { email: { $regex: key, $options: option } }
            ]
        })
            .sort({ "updatedAt": "desc" })
            .limit(type === "soft" ? 4 : 100000)
            .select("-updatedAt -createdAt -__v -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -whoSeenProfile -reciveRequest -sendRequest")




        return NextResponse.json({ success: true, data: { users: getUsersFromDB, posts: getPostsFromDB }, message: "New post created." }, { status: 201 })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}


