import { ContentModerator } from "@/lib/ContentModerator";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    console.log(body);

    if (!body)
      return NextResponse.json(
        { success: false, message: "Text is required" },
        { status: 400 }
      );

    const text = body.text;

    if (!text)
      return NextResponse.json(
        { success: false, message: "Text is required" },
        { status: 400 }
      );

    const contentModerator = new ContentModerator("en");
    let checkText = contentModerator.check(text);

    return NextResponse.json(
      {
        success: true,
        checkText,
        message: !checkText ? "Text is not banned" : "Text is banned",
      },
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
