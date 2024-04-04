import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

    try {


        // console.log(req.headers[Symbol(headers map)])

        // console.log(req.headers.get('cookie'))


        return NextResponse.json({ success: true, data: ["data1", "data2"], message: "User created." }, { status: 201 })

    } catch (error: any) {

        console.log(error.message)
    }

}



