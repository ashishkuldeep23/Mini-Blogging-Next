"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Chat_User,
  ChatInterface,
  Conversation,
  IChatStory,
} from "../../../types/chat-types";
import { FaPencil } from "react-icons/fa6";
import ImageReact from "@/app/components/ImageReact";
import {
  CreateConversations,
  DeleteChatStory,
  fetchAllConversations,
  getChatStrories,
  PostChatStory,
  setCurrentConvo,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
// import MainLoader from "@/app/components/LoaderUi";

import { TfiWorld } from "react-icons/tfi";
import NewChatDiv from "@/app/components/Chat_Componets/NewChatDiv";
import { decryptMessage } from "@/lib/Crypto-JS";
import { useUserState } from "@/redux/slices/UserSlice";
import useInViewAnimate from "@/Hooks/useInViewAnimate";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { useSession } from "next-auth/react";
import { setCloseMoadal } from "@/redux/slices/ModalSlice";
import { MdDelete } from "react-icons/md";
import OnlineUsersSection from "@/app/components/Chat_Componets/DmPageDivs/OnlineUsersSection";
import SingleConvoDiv from "@/app/components/Chat_Componets/DmPageDivs/SingleConvoDiv";

export default function MessagePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useChatData().isLoading;
  const allConversations = useChatData().allConversations;
  const startConvo = useChatData().startConvo;
  const errMsg = useChatData().errMsg;

  // console.log(
  //   allConversations.map((e) => decryptMessage(e?.lastMessage?.content || ""))
  // );

  const EmptyChats =
    !isLoading && allConversations.length === 0 && startConvo.length === 0;

  const [newChatDiv, setNewChatDiv] = useState(false);

  const [searchConvoText, setSearchConvoText] = useState<string>("");

  // const onlineUsers = useChatData().onlineUsers;
  // const userId = useUserState().userData._id;

  // const onlineFriends = Object.values(onlineUsers).filter(
  //   (user) => user.isOnline === true && user.friends.includes(userId)
  // );

  useEffect(() => {
    if (allConversations.length === 0) {
      dispatch(fetchAllConversations());
    }
  }, []);

  const onClickHandlerOfStartConvo = (user: Chat_User) => {
    dispatch(
      CreateConversations({
        friendUserId: user._id,
        successFn: (id) => {
          router.push(`/msgs/${id}`);
        },
      })
    );
  };

  const convoClickHandler = (convo: Conversation) => {
    dispatch(setCurrentConvo(convo));
    router.push(`/msgs/${convo._id}`);
  };

  const newChatClickHandler = () => {
    setNewChatDiv(!newChatDiv);
  };

  return (
    <div className=" min-h-[100vh] bg-black flex flex-col items-center relative">
      {/* <MainLoader isLoading={isLoading} /> */}

      {/* New Chat Div */}
      <NewChatDiv
        newChatDiv={newChatDiv}
        newChatClickHandler={newChatClickHandler}
      />

      {/* Search conversation div  */}
      <div
        className={` my-3 mx-0.5 border-2 border-green-700  h-10 rounded w-full flex justify-center items-center md:w-[70%] lg:w-[60%] ${
          isLoading && " opacity-50"
        } ${EmptyChats && "hidden"}  `}
      >
        <input
          type="text"
          value={searchConvoText}
          onChange={(e) => setSearchConvoText(e.target.value)}
          className=" w-full h-full rounded text-white bg-gray-900 px-2 "
          placeholder="Search Chats"
        />
      </div>

      {/* Show online members and chat story div */}
      <OnlineUsersSection />

      {/* All Msg for empty chats */}
      {EmptyChats ? (
        <div className=" my-5  min-h-[40vh] rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          <p className=" text-2xl w-[60%]  text-center opacity-55 font-semibold ">
            You haven't started a conversation with anyone yet.
          </p>
          <span>
            {errMsg && (
              <p className="text-2xl w-[70%]  text-center opacity-55 font-semibold  text-red-500">
                Error : {errMsg}
              </p>
            )}
          </span>
        </div>
      ) : (
        <></>
      )}

      {/* Err msg when user searching conversation via input box. Div */}
      {!isLoading &&
        allConversations.filter(
          (ele) =>
            ele?.name?.toLowerCase()?.includes(searchConvoText.toLowerCase()) ||
            ele?.participants.some((ele: any) =>
              ele?.name?.toLowerCase()?.includes(searchConvoText.toLowerCase())
            )
        ).length === 0 &&
        searchConvoText && (
          <div className=" text-center flex justify-center items-center flex-col gap-1 my-10">
            <p className=" text-2xl w-[60%]  text-center opacity-55 font-semibold ">
              No conversation found starting with {searchConvoText}
            </p>
            <button
              className=" border-2 border-red-500 font-bold  text-sm px-3 py-1 rounded text-red-500 mt-3"
              onClick={() => setSearchConvoText("")}
            >
              Reset
            </button>
          </div>
        )}

      {/* All convorsations div */}
      {allConversations.length === 0 && isLoading ? (
        // // When loading ------------>>
        <div className=" my-2 text-yellow-500  rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          {Array(12)
            .fill(null)
            .map((_, i) => {
              return (
                <span
                  key={i}
                  className=" block w-full "
                  // href={`/msgs/${i + 1}`}
                >
                  <div className=" my-1 bg-teal-900 text-white h-16 rounded w-full flex  justify-center items-center ">
                    {/* <p>All msgs here {i + 1}</p> */}
                  </div>
                </span>
              );
            })}
        </div>
      ) : (
        // // // Actual UI for all conversations ------->>
        <div className=" my-2   rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          {allConversations
            // .filter(
            //   (ele) =>
            //     ele?.name
            //       ?.toLowerCase()
            //       ?.includes(searchConvoText.toLowerCase()) ||
            //     ele?.participants?.some((ele: any) =>
            //       ele?.name
            //         ?.toLowerCase()
            //         ?.includes(searchConvoText.toLowerCase())
            //     )
            // )
            // .sort((a: any, b: any) => b?.lastMessageAt - a?.lastMessageAt)
            ?.map((ele, i) => {
              return (
                <SingleConvoDiv
                  convo={ele}
                  key={i}
                  isLoading={isLoading}
                  convoClickHandler={convoClickHandler}
                />
              );
            })}
        </div>
      )}

      {/* When a user become a friend and you havn't started a conversation with yet then show this particular div  */}
      {startConvo.length > 0 ? (
        <div className=" mx-auto my-5  bg-teal-950 p-2  min-h-[10vh] rounded w-full flex flex-col justify-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          <h3 className=" ml-4 py-2 opacity-80">
            Start Conversation with your Friends
          </h3>

          {startConvo.map((user, i) => {
            return (
              <div
                key={i}
                onClick={() => onClickHandlerOfStartConvo(user)}
                className={`overflow-hidden my-1 bg-sky-950 text-white min-h-16 rounded w-full flex items-center active:scale-90 hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer ${
                  isLoading && " opacity-50"
                } `}
              >
                <span className="  w-10 h-10 p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
                  <ImageReact
                    className=" w-[99%] h-[99%] rounded-full object-cover object-center "
                    src={user?.profilePic || ""}
                  />
                </span>

                <div>
                  <p className=" text-lg font-semibold">{user?.username}</p>
                  <p className=" opacity-70 text-sm ">
                    Tap to start Conversation
                  </p>
                </div>
              </div>
              // </Link>
            );
          })}
        </div>
      ) : (
        <></>
      )}

      {/* Create new chat and new group Pencil icon div */}
      {!isLoading && (
        <div
          onClick={newChatClickHandler}
          className=" w-12 h-12 fixed bottom-7 right-7  md:bottom-10 md:right-[12rem] lg:right-[25rem] bg-sky-500 rounded-full hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer transition-all flex justify-center items-center"
        >
          <FaPencil className=" w-7 h-7" />
        </div>
      )}
    </div>
  );
}
