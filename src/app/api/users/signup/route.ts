
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {


    await  connect()


    try {

        // console.log("Called ----------->")

        // console.log(req)

        const reqBody = await req.json()

        // console.log(reqBody)

        const { username, email, password } = reqBody

        // // validation here --->

        const getUserWithMail = await User.findOne({ email })


        if (getUserWithMail) {
            return NextResponse.json({ success: false, message: 'User alredy exist' }, { status: 400 })
        }


        // // // hash pass

        const salt = await bcryptjs.genSalt(10)
        const hashPass = await bcryptjs.hash(password, salt)

        let createUser = new User({
            username,
            email,
            password: hashPass
        })

        createUser = await createUser.save()

        return NextResponse.json({ success: true, data: createUser, message: "User created." }, { status: 201 })


    } catch (error: any) {
        console.log("Error!")
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}




