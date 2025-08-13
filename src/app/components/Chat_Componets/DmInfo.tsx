"use client";

import { useChatData } from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import ImageReact from "../ImageReact";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCloseMoadal } from "@/redux/slices/ModalSlice";

const DmInfo = () => {
  const currentConvo = useChatData().currentConvo;
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const friendData = currentConvo?.participants.find(
    (user) => user?._id !== session?.user.id
  );

  const friendDivClickHandler = () => {
    setTimeout(() => {
      dispatch(setCloseMoadal());
    }, 500);

    router.push(`/user/${friendData?._id}`);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className=" w-screen  flex flex-col justify-center items-center"
    >
      <p>
        You are <span className=" font-bold">talking</span> with{" "}
      </p>

      {friendData?._id ? (
        <div className=" -ml-5 my-4 flex gap-2 active:scale-90 transition-all hover:cursor-pointer ">
          <span className="p-0.5 w-16 h-16 border-2 border-sky-500 rounded-full">
            <ImageReact
              src={friendData?.profilePic}
              className=" w-14 h-14 object-cover rounded-full"
            />
          </span>
          <div
            onClick={friendDivClickHandler}
            className=" flex flex-col items-start mt-1.5"
          >
            <p className=" font-semibold text-xl ">{friendData?.username}</p>
            <button className=" text-xs font-bold px-2 bg-sky-500 hover:bg-sky-700 rounded-md active:scale-90 transition-all active:bg-sky-700">
              See Profile
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DmInfo;
