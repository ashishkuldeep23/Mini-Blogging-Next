import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  await connect();

  try {
    // console.log("fsdfsdfsdfsdfsfd")

    /// // // find post and user data

    const session = await getServerSession();

    // console.log("session", session);

    const userEmail = session?.user?.email;

    // console.log("userId", userEmail);

    let userData = await User.findOne({ email: userEmail });

    if (!userData)
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );

    // console.log(userData);
    // console.log(userData.savedPost);

    let data = {} as any;
    for (let key of userData.savedPost.keys()) {
      //   console.log("key", key);
      let arr = [];
      if (userData.savedPost.get(key).length > 0) {
        for (let post of userData.savedPost.get(key)) {
          let postData = await Post.findById(post).select(
            "-updatedAt -createdAt -__v "
          );
          if (postData) {
            arr.push(postData);
          }
        }
      }
      data[key] = arr;
    }

    // console.log(userData.savedPost);
    return NextResponse.json(
      { success: true, data, message: "Saved Post!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await connect();

  try {
    // console.log("fsdfsdfsdfsdfsfd")

    const reqBody = await req.json();

    // console.log(reqBody)

    const { postId, userId, saveKey } = reqBody;

    if (!postId || !userId || !saveKey) {
      return NextResponse.json(
        { success: false, message: "Mandatory fields not given." },
        { status: 404 }
      );
    }

    let postData = await Post.findById(postId).select(
      "-updatedAt -createdAt -__v "
    );

    if (!postData)
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );

    /// // // find post and user data
    let userData = await User.findById(userId);

    if (!userData)
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );

    // console.log(userData);
    // console.log(userData.savedPost);

    // Initialize if not exists
    let check = userData.savedPost.get(saveKey);

    // console.log("check", check);

    if (!check) {
      userData.savedPost.set(saveKey, [postId]);
    } else {
      userData.savedPost.set(saveKey, [postId, ...check]);
    }

    // Add a post to 'tech' category
    // userData.savedPost.get("tech").push(postId);
    await userData.save();

    // // // now save user id in post data;

    if (postData.savedById) {
      postData.savedById = [userId, ...postData.savedById];
    } else {
      postData.savedById = [userId];
    }

    await postData.save();

    // console.log(userData.savedPost);
    return NextResponse.json(
      { success: true, data: userData, message: "Saved Post!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connect();

  try {
    // console.log("fsdfsdfsdfsdfsfd");

    const reqBody = await req.json();

    // console.log(reqBody)

    const { postId, userId } = reqBody;

    if (!postId || !userId) {
      return NextResponse.json(
        { success: false, message: "Mandatory fields not given." },
        { status: 404 }
      );
    }

    let postData = await Post.findById(postId).select(
      "-updatedAt -createdAt -__v "
    );

    if (!postData)
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );

    /// // // find post and user data
    let userData = await User.findById(userId);

    if (!userData)
      return NextResponse.json(
        { success: false, message: "User not found. Please LogIn again." },
        { status: 404 }
      );

    for (let key of userData.savedPost.keys()) {
      //   console.log("key", key);
      if (userData.savedPost.get(key).includes(postId)) {
        // console.log("postId", postId);
        userData.savedPost.set(
          key,
          userData.savedPost
            .get(key)
            .filter((ele: any) => ele.toString() !== postId)
        );
      }
    }

    await userData.save();

    // // // now save user id in post data;
    if (postData.savedById.includes(userId)) {
      postData.savedById = postData.savedById.filter(
        (id: string) => id.toString() !== userId
      );
    }

    await postData.save();

    // console.log(userData.savedPost);
    return NextResponse.json(
      { success: true, data: userData, message: "Saved Post!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
}
