import mongoose from "mongoose";
import { MONGO_URL } from "@/constant";
// import { NextResponse } from "next/server";

// // // Technique by hitesh sir ------->
type ConnectionObj = {
  isConnected?: number;
};

const checkConnection: ConnectionObj = {};

const MONGODB_URI = MONGO_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any)["mongoose"];

if (!cached) {
  cached = (global as any)["mongoose"] = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// export async function connect() {
//   if (checkConnection.isConnected) {
//     console.log("Already connected to database.");
//     return;
//   }

//   try {
//     let db = await mongoose.connect(MONGODB_URI);

//     // // // Set connection value if connected to db
//     checkConnection.isConnected = db.connections[0].readyState;

//     // console.log(db.connections[0])

//     const connection = mongoose.connection;

//     connection.on("connected", () => {
//       console.log("DB connected successfully");
//     });

//     connection.on("error", (err) => {
//       console.log("Error in db connection.");
//       console.log(err);
//       process.exit();
//     });
//   } catch (error: any) {
//     console.log("Something goes wrong!");
//     console.log(error);
//     process.exit();

//     // return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
//   }
// }
