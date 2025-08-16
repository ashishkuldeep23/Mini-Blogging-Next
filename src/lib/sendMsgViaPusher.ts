import toast from "react-hot-toast";

// // // Not used anymore ------------>>
export const sendMsgViaPusher = async ({
  event,
  channelName,
  bodyData,
}: {
  event: string;
  channelName: string;
  bodyData: any;
}) => {
  try {
    let req = await fetch("/api/pusher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: event,
        data: bodyData,
        channel: channelName,
        socketId: "",
      }),
    });

    console.log({ req });
  } catch (error: any) {
    console.log(error?.message);
    toast.error(error?.message || "Error in sending msg.");
  }
};
