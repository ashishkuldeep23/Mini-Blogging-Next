import cloudinary from "@/lib/cloudinaryConfig";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromServer } from "../getUserDataServer";

export const POST = async (req: NextRequest) => {
  try {
    //   console.log("Content-Type:", req.headers.get("content-type"));

    // console.log(req)

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // console.log(file);
    // console.log(file.type);

    // // // Here check user status --------->>

    const userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found.Please LogIn again." },
        { status: 404 }
      );
    }

    // Convert File → Buffer → Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // console.log(bytes);
    // console.log(buffer);
    // console.log(base64);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "MiniBlogging", // optional folder
      resource_type: "auto", // auto-detects image/video/raw
    });

    console.log({ result });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        data: {
          url: result.url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
};

// // // Update image route --------->>
export const PUT = async (req: NextRequest) => {
  try {
    //   console.log("Content-Type:", req.headers.get("content-type"));

    // console.log(req)

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const publicId = formData.get("publicId") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "No publicId given" },
        { status: 400 }
      );
    }

    // console.log(file);

    // // // Here check user status --------->>

    const userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found.Please LogIn again." },
        { status: 404 }
      );
    }

    // Convert File → Buffer → Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // console.log(bytes);
    // console.log(buffer);
    // console.log(base64);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "MiniBlogging", // optional folder
      public_id: publicId, // overwrites existing file
      overwrite: true,
    });

    // console.log({ result });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        data: {
          url: result.url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
};

// // // Delete image route --------->>
export const DELETE = async (req: NextRequest) => {
  try {
    //   console.log("Content-Type:", req.headers.get("content-type"));

    // console.log(req)

    const formData = await req.formData();
    const publicId = formData.get("publicId") as string;

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "No publicId given" },
        { status: 400 }
      );
    }

    // console.log(file);

    // // // Here check user status --------->>

    const userData = await getUserDataFromServer();

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found.Please LogIn again." },
        { status: 404 }
      );
    }

    // console.log(bytes);
    // console.log(buffer);
    // console.log(base64);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    // // // { result: "ok" } if deleted

    // console.log({ result });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
};
