import { connect } from "@/dbConfig/dbConfig";
// import Post from "@/models/postModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";





type WhatUpdateData = "sendFriendRequest" | "addFriend" | 'removeFriend' | "cancelFrndRequest"



export async function PUT(req: NextRequest) {
    connect()

    try {

        // console.log("fsdfsdfsdfsdfsfd ======================> ")

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


            // console.log("adding friend here ------------>")


            // // // Samne wala user jo request accept kr raha hai. ========================================>
            let reciverUser = await User.findById(reciver)

            // // From recive req

            let findIndexR1 = reciverUser.reciveRequest.findIndex((ele: any) => ele.toString() === sender.toString())

            if (findIndexR1 !== -1) {
                reciverUser.reciveRequest.splice(findIndexR1, 1)
            }

            // // From send req

            let findIndexR2 = reciverUser.sendRequest.findIndex((ele: any) => ele.toString() === sender.toString())

            if (findIndexR2 !== -1) {
                reciverUser.sendRequest.splice(findIndexR2, 1)
            }



            // // // now add into friend list ----->

            if (reciverUser.friends) {

                if (!reciverUser.friends.includes(sender)) {
                    reciverUser.friends.push(sender)
                }

            } else {
                reciverUser.friends = [sender]
            }

            await reciverUser.save()


            // console.log({ reciverUser })



            // // // Jo user accept request bheja tha wo ==================================================>

            let senderUser = await User.findById(sender)

            let findIndexS1 = senderUser.sendRequest.findIndex((ele: any) => ele.toString() === reciver.toString())
            // console.log({ findIndexS })
            if (findIndexS1 !== -1) {
                senderUser.sendRequest.splice(findIndexS1, 1)
            }


            let findIndexS2 = senderUser.reciveRequest.findIndex((ele: any) => ele.toString() === reciver.toString())
            // console.log({ findIndexS })
            if (findIndexS2 !== -1) {
                senderUser.reciveRequest.splice(findIndexS2, 1)
            }



            if (senderUser.friends) {
                if (!senderUser.friends.includes(reciver)) {
                    senderUser.friends.push(reciver)
                }

                // else {
                //     console.log("Yes 2")
                // }

            } else {
                senderUser.friends = [reciver]
            }


            // console.log({ senderUser })

            updatedUser = await senderUser.save()

        }

        else if (whatUpdate === 'removeFriend') {


            let sendReqUser = await User.findById(sender)

            let findIndexS1 = sendReqUser.friends.findIndex((ele: any) => ele.toString() === reciver.toString())

            if (findIndexS1 !== -1) {
                sendReqUser.friends.splice(findIndexS1, 1)
            }

            
            await sendReqUser.save()


            let reciveReqUser = await User.findById(reciver)

            let findIndexR1 = reciveReqUser.friends.findIndex((ele: any) => ele.toString() === sender.toString())

            if (findIndexR1 !== -1) {
                reciveReqUser.friends.splice(findIndexR1, 1)
            }

                        
            await reciveReqUser.save()


            updatedUser = sendReqUser

        }

        else if (whatUpdate === "cancelFrndRequest") {


            let sendReqUser = await User.findById(sender)

            let findIndexS1 = sendReqUser.reciveRequest.findIndex((ele: any) => ele.toString() === reciver.toString())

            if (findIndexS1 !== -1) {
                sendReqUser.reciveRequest.splice(findIndexS1, 1)
            }


            let findIndexS2 = sendReqUser.sendRequest.findIndex((ele: any) => ele.toString() === reciver.toString())

            if (findIndexS2 !== -1) {
                sendReqUser.sendRequest.splice(findIndexS2, 1)
            }

            await sendReqUser.save()


            let reciveReqUser = await User.findById(reciver)

            let findIndexR1 = reciveReqUser.sendRequest.findIndex((ele: any) => ele.toString() === sender.toString())

            if (findIndexR1 !== -1) {
                reciveReqUser.sendRequest.splice(findIndexR1, 1)
            }

            let findIndexR2 = reciveReqUser.reciveRequest.findIndex((ele: any) => ele.toString() === sender.toString())

            if (findIndexR2 !== -1) {
                reciveReqUser.reciveRequest.splice(findIndexR1, 1)
            }


            
            await reciveReqUser.save()

            updatedUser = sendReqUser

        }

        else {
            return NextResponse.json({ success: false, message: 'whatUpdate is not given.' }, { status: 400 })
        }




        return NextResponse.json({ success: true, whatUpdate, data: updatedUser, message: "Post updated successfully." }, { status: 201 })

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}
