import { connect } from "@/dbConfig/dbConfig";
// import Post from "@/models/postModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";





type WhatUpdateData = "sendFriendRequest" | "addFriend"



export async function PUT(req: NextRequest) {
    connect()

    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const whatUpdate: WhatUpdateData = reqBody.whatUpdate
        const { sender, reciver } = reqBody

        if (!whatUpdate) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }

        // return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })


        // // // if else for updates --------------->

        let updatedUser = null;

        if (whatUpdate === 'sendFriendRequest') {


            // // // send request me searchedUser ki latest info bhejni hogi (added in reciveRequest) ------------>




            let reciverUser = await User.findByIdAndUpdate(
                reciver,
                {
                    $push: { reciveRequest: sender },
                },
                { new: true }
            )

            // console.log({ reciverUser })


            let senderUser = await User.findByIdAndUpdate(
                sender,
                {
                    $push: { sendRequest: reciver },
                },
                { new: true }
            )


            // console.log({ senderUser })


            updatedUser = reciverUser

        }


        else if (whatUpdate === "addFriend") {


            // // // Samne wala user jo request accept kr raha hai. ========================================>
            let reciverUser = await User.findById(reciver)

            let findIndexR = reciverUser.reciveRequest.findIndex((ele: any) => ele.toString() === sender.toString())

            // console.log(findIndex)
            console.log({ findIndexR })

            reciverUser.reciveRequest.splice(findIndexR, 1)

            if (reciverUser.friends) {
                reciverUser.friends.push(sender)
            } else {
                reciverUser.friends = [sender]
            }

            await reciverUser.save()


            console.log({ reciverUser })


            
            // // // Jo user accept request bheja tha wo ==================================================>

            let senderUser = await User.findById(sender)
            let findIndexS = senderUser.sendRequest.findIndex((ele: any) => ele.toString() === reciver.toString())

            console.log({ findIndexS })

            senderUser.sendRequest.splice(findIndexS, 1)

            if (senderUser.friends) {
                senderUser.friends.push(sender)
            } else {
                senderUser.friends = [sender]
            }


            console.log({ senderUser })

            updatedUser = await senderUser.save()

        }
        // else {
        //     return NextResponse.json({ success: false, message: 'whatUpdate is not given.' }, { status: 400 })
        // }




        return NextResponse.json({ success: true, whatUpdate, data: updatedUser, message: "Post updated successfully." }, { status: 201 })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}
