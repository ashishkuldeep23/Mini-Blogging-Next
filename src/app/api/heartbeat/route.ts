// app/api/heartbeat/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function POST() {
  try {
    // ✅ connect DB
    await connect();

    // ✅ get session
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ update user lastSeen + online status
    await User.findByIdAndUpdate(session.user.id, {
      isOnline: true,
      lastSeen: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Heartbeat error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
