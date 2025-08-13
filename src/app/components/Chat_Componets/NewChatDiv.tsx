"use client";

import {
  getProfileData,
  getUserData,
  setUserDataBySession,
  useUserState,
} from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageReact from "../ImageReact";

// import React from "react";

const NewChatDiv = ({
  newChatDiv,
  newChatClickHandler,
}: {
  newChatDiv: boolean;
  newChatClickHandler: () => void;
}) => {
  const friends = useUserState()?.userData?.friendsAllFriend;
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const [showNewGroupDiv, setShowNewGroupDiv] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      let user = session.user;
      dispatch(setUserDataBySession({ ...user }));
    }

    // // // get user data by api (All Data) ----------->
    if (session?.user._id) {
      dispatch(getProfileData({ userId: session?.user._id, noPostData: true }));
    }
  }, [session]);

  return (
    <div
      onClick={newChatClickHandler}
      style={{
        backdropFilter: "blur(5px) saturate(1.7)",
        background: "#efe6f300",
      }}
      className={` hover:cursor-pointer fixed top-0 left-0 w-screen  transition-all duration-500 ease-in-out z-10 flex justify-center items-center overflow-hidden  ${
        !newChatDiv ? " h-0" : " h-screen"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" hover:cursor-auto relative w-[80%] h-[80%] bg-black rounded-md shadow-lg shadow-sky-500 p-2 border-t border-sky-500 "
      >
        <p className=" text-center  text-lg">Start a New Chat</p>
        <span
          onClick={newChatClickHandler}
          className=" absolute top-3 right-3 px-2 py-0.5 rounded-md bg-red-950 font-bold  "
        >
          X
        </span>

        <div
          className={` ${
            !showNewGroupDiv ? " h-0" : " h-[55vh]"
          } w-full rounded-md bg-green-950 transition-all duration-500 ease-in-out overflow-hidden  flex flex-col gap-1.5 justify-center items-center `}
        ></div>

        <div
          className={`max-h-[80%] overflow-y-scroll flex flex-col gap-1.5 transition-all duration-500 ease-in-out overflow-hidden ${
            !showNewGroupDiv ? " h-auto" : " h-0"
          }  `}
        >
          {friends &&
            friends.map((friend) => {
              return (
                <div
                  key={friend._id}
                  className={`overflow-hidden  bg-green-950 text-white min-h-16 rounded w-full flex items-center active:scale-90 hover:bg-green-700 active:bg-green-700 hover:cursor-pointer  `}
                >
                  <span className="  w-10  p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
                    <ImageReact
                      className=" w-[99%] h-[99%]rounded-full object-cover"
                      src={friend?.profilePic || ""}
                    />
                  </span>

                  <div>
                    <p className=" text-lg font-semibold">{friend?.username}</p>
                    <p className=" opacity-70 text-sm ">Start a new chat</p>
                  </div>
                </div>
              );
            })}
        </div>

        <div>
          <button
            onClick={() => {
              setShowNewGroupDiv((p) => !p);
            }}
            className=" w-full text-center bg-green-600 h-10 my-2 text-xl font-bold rounded-lg "
          >
            New {showNewGroupDiv ? "Chat" : "Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatDiv;
