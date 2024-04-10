import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function connect() {
    try {

        await mongoose.connect(process.env.MONGO_URL!)

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log('DB connected successfully')
        })

        connection.on("error", (err) => {
            console.log("Error in db connection.")
            console.log(err)
            process.exit()
        })

    } catch (error : any) {
        console.log("Something goes wrong!")
        console.log(error)

        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })

    }

}