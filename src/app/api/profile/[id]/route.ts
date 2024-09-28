
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { isValidObjectId, model, modelNames, models } from "mongoose"

// import { getServerSession } from "next-auth/next"
// import { NextApiRequest } from "next";


// import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next"



export async function POST(req: NextRequest, context: any) {

    await  connect()
    // const g = getServerSession()
    // console.log(g)

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


        // // // This is how we can get user data in backend. data included like (name , email , profilePhoto).
        const session = await getServerSession()

        // console.log({session})




        // const reqBody = await req.json()
        // console.log(reqBody)
        // const { searchingUserId } = reqBody
        // console.log({ userId, searchingUserId })


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")

        // console.log(allComments)


        let user = await User.findById(userId)
            .populate({
                path: "sendRequest",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -reciveRequest -sendRequest -friends -whoSeenProfile -notification",
            })
            .populate({
                path: "reciveRequest",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -reciveRequest -sendRequest -friends -whoSeenProfile -notification",
            })
            .populate({
                path: "whoSeenProfile",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -reciveRequest -sendRequest -friends -whoSeenProfile -notification",
            })
            .select("-updatedAt -createdAt -__v -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password")


        // // // D'not populate friends here becoz i want to check include with _id's

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found with given id.' }, { status: 404 })
        }


        // // // Getting all post for this user -------->

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
            .sort({ "createdAt": "desc" })
        // .exec()



        // console.log({ user })


        // // // An Experimental logic here --------------------->
        // // // IF user is not same then remove these data from here --------------->
        if (session?.user.email && (session?.user.email !== user.email)) {
            user.sendRequest = null
            user.whoSeenProfile = null
        }




        // // // Who is serching your id logic here ---------->
        // // // Logic for friendship status -------->

        let friendsAllFriend = [];


        if (
            session?.user.email
            // &&
            // (session?.user.email !== user.email)
            &&
            user.friends
            &&
            user.friends.length > 0
        ) {

            // // // New logic here ----------->


            // // // Getting user id becoz i dont have in server directly ------>
            let searchingUserId = await User.findOne({ email: session?.user.email })

            // console.log({ searchingUserId })

            // // // Here two conditions ------------->
            // // 1. Searching user should frined of searched user.
            // // 2. Searching user and searched user both should be.

            if (user.friends.includes(searchingUserId._id.toString()) || user.email === searchingUserId.email) {

                // console.log(152)

                let getUserFrineds = await User.findById(user._id)
                    .populate({
                        path: "friends",
                        // match: { isDeleted: false },
                        select: "-updatedAt -createdAt -__v -friendshipRequests -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password -whoSeenProfile -notification",
                    })


                // console.log(getUserFrineds)

                friendsAllFriend = getUserFrineds.friends

            } else {

                // console.log(0)

                friendsAllFriend = []
            }


        }


        // console.log({ user, friendsAllFriend })


        return NextResponse.json({
            success: true,
            data: {
                user,
                posts,
                friendsAllFriend
            },
            message: "New post created."
        }, { status: 200 })

        // return res.status(201).json({ success: true, data: [], message: "New post created." })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })

        // return res.status(500).json({ success: false, data: [], message: `${error.message} (Server Error)` })
    }
}


