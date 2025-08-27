import { connect } from "@/dbConfig/dbConfig";
import { ContentModerator } from "@/lib/ContentModerator";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();

  try {
    // console.log("fsdfsdfsdfsdfsfd")

    const reqBody = await req.json();

    // console.log(reqBody)

    const { title, category, promptReturn, author, tested, metaDataUrl } =
      reqBody;
    // // // be default tested is true (Mtlb meta data check kiya aur sb shi hai ) .

    if (!category || !promptReturn)
      return NextResponse.json(
        { success: false, message: "Mandatory fields not given." },
        { status: 400 }
      );

    if (!author)
      return NextResponse.json(
        { success: false, message: "Author id is not given." },
        { status: 400 }
      );

    // // // Check author here -------->
    let findUser = await User.findById(author).select(
      "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password"
    );

    if (!findUser)
      return NextResponse.json(
        { success: false, message: "No User find with given post id." },
        { status: 404 }
      );

    // let BannedWord = false;
    const contentModerator = new ContentModerator("en");

    let bannedWord =
      contentModerator.check(reqBody.title) ||
      contentModerator.check(reqBody.category) ||
      contentModerator.check(reqBody.promptReturn) ||
      contentModerator.check(reqBody.aiToolName) ||
      false;

    let pending = "approved";

    if (metaDataUrl && !tested) {
      pending = "pending";
    }

    let createNewPost = new Post({ ...reqBody, bannedWord, pending });

    createNewPost = await createNewPost.save();

    await createNewPost.populate(
      "author",
      "-updatedAt -createdAt -__v -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password"
    );

    // return NextResponse.json({ success: true, data: createNewPost, message: "User created." }, { status: 201 })

    // let upadatedPost = createNewPost

    // upadatedPost.author = findUser

    // console.log(upadatedPost)

    return NextResponse.json(
      { success: true, data: createNewPost, message: "New post created." },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest) {
//     try {

//         // console.log("fsdfsdfsdfsdfsfd")
//         const token = req.cookies.get('token')

//         console.log(token)

//         console.log(req)

//         return NextResponse.json({ success: true, data: [], message: "New post created." }, { status: 201 })

//     } catch (error: any) {

//         console.log(error.message)
//         return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
//     }
// }
