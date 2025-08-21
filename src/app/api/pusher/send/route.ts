import { pusherServer } from "@/lib/pusherServer";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { event, data, channel } = await req.json();

    // console.log({ event, data, channel });

    if (!channel || !event || !data)
      return NextResponse.json(
        { success: false, message: "Missing data." },
        { status: 400 }
      );

    let responce = await pusherServer.trigger(`${channel}`, event, data);

    // console.log(responce.status);
    // console.log(responce.body)
    // console.log(responce.status)

    return NextResponse.json(
      { success: true, message: "Event triggered.", responce },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
};
