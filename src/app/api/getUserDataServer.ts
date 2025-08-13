import User from "@/models/userModel";
import { getServerSession } from "next-auth";

export const getUserDataFromServer = async () => {
  try {
    const session = await getServerSession();
    if (!session) {
      console.log("no session");
      return null;
    }

    const userEmail = session?.user?.email;

    if (!userEmail) {
      console.log("no email");
      return null;
    }

    let userData = await User.findOne({ email: userEmail });

    if (!userData) {
      console.log("no userData");
      return null;
    }

    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
