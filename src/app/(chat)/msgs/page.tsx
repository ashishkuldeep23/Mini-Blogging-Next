"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Chat_User, Conversation, IChatStory } from "../../../types/chat-types";
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

export default function MessagePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useChatData().isLoading;
  const allConversations = useChatData().allConversations;
  const startConvo = useChatData().startConvo;
  const errMsg = useChatData().errMsg;

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

      <OnlineUsersSection />

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

      {allConversations.length === 0 && isLoading ? (
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
        <div className=" my-2   rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          {allConversations
            .filter(
              (ele) =>
                ele?.name
                  ?.toLowerCase()
                  ?.includes(searchConvoText.toLowerCase()) ||
                ele?.participants.some((ele: any) =>
                  ele?.name
                    ?.toLowerCase()
                    ?.includes(searchConvoText.toLowerCase())
                )
            )
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
                    className=" w-[99%] h-[99%]rounded-full object-cover"
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

const OnlineUsersSection = () => {
  const callModalFn = useOpenModalWithHTML();
  const onlineUsers = useChatData().onlineUsers;
  const userId = useUserState().userData._id;
  const { ref, inView } = useInViewAnimate();
  const userData = useUserState().userData;
  const isLoading = useChatData().isLoading;
  const allConversations = useChatData().allConversations;
  const startConvo = useChatData().startConvo;
  const onlineFriends = Object.values(onlineUsers).filter(
    (user) => user.isOnline === true && user.friends.includes(userId)
  );
  const EmptyChats =
    !isLoading && allConversations.length === 0 && startConvo.length === 0;

  const selfDivClickHandler = () => {
    callModalFn({ innerHtml: <AddChatStoryDiv /> });
  };

  const chatStrories = useChatData().chatStrories;

  const ownChatStrory = chatStrories?.find(
    (story) => story?.author?._id === userId
  );
  const friendsChatStories = chatStrories?.filter(
    (story) => story?.author?._id !== userId
  );

  // console.log({ chatStrories });

  // const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const getAllChatStrories = useCallback(() => {
    if (chatStrories?.length === 0 && userId) {
      dispatch(getChatStrories(userId));
    }
  }, [chatStrories?.length, userId]);

  // useEffect(() => {
  //   getAllChatStrories();
  //   // console.log("Call api to get all chat stories");
  // }, [userId]);

  useEffect(() => {
    getAllChatStrories();
  }, [getAllChatStrories]);

  return (
    <div
      className={`  my-1 h-[5.5rem] rounded  flex justify-start px-2 items-center w-[98vw] sm:w-[97%] md:w-[70%] lg:w-[60%] ${
        isLoading && " opacity-50"
      } ${EmptyChats && "hidden"} `}
    >
      <div
        // ref={(e) =>{}}
        ref={ref as React.LegacyRef<HTMLDivElement>}
        className={` min-w-20 relative group rounded-md   flex flex-col  justify-end items-center p-1 m-0 active:scale-75 hover:cursor-pointer transition-all relativ 
            ${inView ? "animate__animated animate__jackInTheBox " : ""}
             `}
        onClick={selfDivClickHandler}
      >
        <span className=" absolute -top-1 border-2 border-gray-500 rounded-md px-1 py-0.5 z-[5] text-[0.5rem] bg-black ">
          {ownChatStrory?.text
            ? ownChatStrory?.text?.length > 25
              ? `${ownChatStrory?.text?.slice(0, 25)}...`
              : ownChatStrory?.text
            : "Add Note"}
        </span>

        <span className="relative  active:scale-90 transition-all  ">
          <ImageReact
            src={userData.profilePic}
            className=" h-16 w-16 rounded-full object-cover  "
          />

          <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-1 right-1 "></span>
        </span>

        <p className=" text-xs text-center  leading-[0.6rem] capitalize ">
          You
        </p>
      </div>

      <div className=" scrooller_bar_small pl-1.5 gap-1  h-full flex  justify-start items-center overflow-y-auto">
        {friendsChatStories?.map((story, i) => (
          <SingleChatStory key={i} story={story} />
        ))}

        {onlineFriends
          .filter(
            (user) =>
              friendsChatStories?.findIndex(
                (story) => story?.author?._id === user._id
              ) === -1
          )
          .map((user, i) => (
            <SingleOnlineUserDiv key={i} user={user} />
          ))}
      </div>
    </div>
  );
};

const AddChatStoryDiv = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  // const { data: session } = useSession();
  const userId = useUserState().userData._id;

  const submitHandler = () => {
    //  dispatch(addNote())

    dispatch(PostChatStory({ text, userId: userId || "" }));
    dispatch(setCloseMoadal());
  };

  const findChatStory = useChatData().chatStrories?.find(
    (story) => story?.author?._id === userId
  );

  const leftTime = findChatStory?.expiresAt
    ? new Date(findChatStory?.expiresAt).getTime() - new Date().getTime()
    : 0;

  const leftTimeInHourAndMint =
    leftTime > 0 ? Math.floor(leftTime / 1000 / 60 / 60) : 0;

  if (!userId) return <></>;

  if (findChatStory)
    return (
      <div className=" relative min-w-28 flex justify-center items-center flex-col">
        <p>{findChatStory?.text}</p>
        <p>{`${leftTimeInHourAndMint}H left`}</p>
        <button
          className=" absolute bottom-0 right-0 rounded-md hover:bg-red-200 active:scale-75 transition-all text-red-500 border-1 border-red-500"
          onClick={() => dispatch(DeleteChatStory(findChatStory?._id))}
        >
          <MdDelete />
        </button>
      </div>
    );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center w-full bg-black text-white rounded p-2"
    >
      <p className="text-center">Add note for your friends for 24 hour.</p>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        type="text"
        className="w-full p-2 mt-2 bg-black border-2 border-gray-600 rounded"
        placeholder="Add Note"
      />
      <button
        className="w-full p-2 mt-2 bg-gray-600 hover:bg-gray-700 rounded"
        onClick={() => submitHandler()}
      >
        Add
      </button>
    </div>
  );
};

const SingleChatStory = ({ story }: { story: IChatStory }) => {
  const { ref, inView } = useInViewAnimate();
  const callModalFn = useOpenModalWithHTML();
  const onlineUsers = useChatData().onlineUsers;
  const userId = useUserState().userData._id;
  const onlineFriendsIdes = Object.values(onlineUsers)
    .filter((user) => user.isOnline === true && user.friends.includes(userId))
    .map((u) => u?._id);

  const isOnline = onlineFriendsIdes.includes(story?.author?._id);

  const allDirectConvoIds = useChatData().allConversations.filter(
    (e) => e?.type === "direct"
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onlineClickHandler = () => {
    if (isOnline) {
      let findConvo = allDirectConvoIds.find(
        (convo) => convo?.directUserId === userId
      );

      if (findConvo) {
        dispatch(setCurrentConvo(findConvo));
        router.push(`/msgs/${findConvo._id}`);
      } else {
        // console.log("Now we need to call api for create convo.");

        dispatch(
          CreateConversations({
            friendUserId: userId,
            successFn: (id) => {
              router.push(`/msgs/${id}`);
            },
          })
        );
      }
    } else {
      const innerHtml = (
        <div className="flex flex-col items-center justify-center">
          <p className=" text-xl font-semibold">{story?.text}</p>
          <span>by</span>
          <p>{story?.author?.username}</p>
        </div>
      );

      callModalFn({ innerHtml });
    }
  };

  return (
    <div
      ref={ref as React.LegacyRef<HTMLDivElement>}
      className={` min-w-20 group rounded-md  flex flex-col  justify-end items-center p-1 m-0 active:scale-75 hover:cursor-pointer transition-all relativ 
    ${inView ? "animate__animated animate__jackInTheBox " : ""}
    `}
      onClick={onlineClickHandler}
    >
      <span className=" absolute -top-1 border-2 border-gray-500 rounded-md px-1 py-0.5 z-[5] text-[0.5rem] bg-black ">
        {story?.text
          ? story?.text?.length > 25
            ? `${story?.text?.slice(0, 25)}...`
            : story?.text
          : "Add Note"}
      </span>

      <span className="relative  active:scale-90 transition-all  ">
        <ImageReact
          src={story.author.profilePic}
          className=" h-16 w-16 rounded-full object-cover  "
        />

        {isOnline && (
          <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-1 right-1 "></span>
        )}
      </span>

      <p className=" text-[0.5rem]  text-center  leading-[0.6rem] capitalize ">
        {story.author.username || "Name"}
      </p>
    </div>
  );
};
const SingleOnlineUserDiv = ({ user }: { user: Chat_User }) => {
  const { ref, inView } = useInViewAnimate();
  const dispatch = useDispatch<AppDispatch>();
  const allDirectConvoIds = useChatData().allConversations.filter(
    (e) => e?.type === "direct"
  );
  // .map((e) => e?._id);

  const router = useRouter();

  const onlineClickHandler = () => {
    let findConvo = allDirectConvoIds.find(
      (convo) => convo?.directUserId === user?._id
    );

    if (findConvo) {
      dispatch(setCurrentConvo(findConvo));
      router.push(`/msgs/${findConvo._id}`);
    } else {
      // console.log("Now we need to call api for create convo.");

      dispatch(
        CreateConversations({
          friendUserId: user._id,
          successFn: (id) => {
            router.push(`/msgs/${id}`);
          },
        })
      );
    }

    // console.log(allDirectConvoIds);
    // console.log(user._id);
    // let index = allDirectConvoIds.indexOf(user._id);
    // console.log(index);
    // if (index !== -1) {
    //   router.push(`/msgs/${allDirectConvoIds[index]}`);
    // }
  };

  return (
    <div
      // ref={(e) =>{}}
      ref={ref as React.LegacyRef<HTMLDivElement>}
      className={` min-w-20 group rounded-md  flex flex-col  justify-end items-center p-1 m-0 active:scale-75 hover:cursor-pointer transition-all relativ 
    ${inView ? "animate__animated animate__jackInTheBox " : ""}
    `}
      onClick={onlineClickHandler}
    >
      <span className="relative  active:scale-90 transition-all  ">
        <ImageReact
          src={user.profilePic}
          className=" h-16 w-16 rounded-full object-cover  "
        />

        <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-1 right-1 "></span>
      </span>

      <p className=" text-[0.5rem]  text-center  leading-[0.6rem] capitalize ">
        {user.username || "Name"}
      </p>
    </div>
  );
};

const SingleConvoDiv = ({
  convo,
  isLoading = false,
  convoClickHandler,
}: {
  convo: Conversation;
  isLoading?: boolean;
  convoClickHandler?: (c: Conversation) => void;
}) => {
  // console.log(convo?.directUserId);

  const isOnline = useChatData()?.onlineUsers?.[convo?.directUserId || ""];

  return (
    <Link
      // key={i}
      className={`block w-full overflow-hidden ${isLoading && " opacity-50"}  `}
      href={`/msgs/${convo?._id}`}
      onClick={() => {
        convoClickHandler && convoClickHandler(convo);
      }}
    >
      <div className=" my-1 bg-sky-950 text-white min-h-16 max-h-28 rounded w-full flex items-center active:scale-90 hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer overflow-hidden ">
        <span className=" relative max-w-10 min-w-10 h-10 max-h-10 min-h-10 w-10 p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
          <ImageReact
            className="  w-[99%] h-[99%] rounded-full object-cover"
            src={convo?.avatar || ""}
          />

          {isOnline && (
            <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-0.5 right-0.5 "></span>
          )}
        </span>

        <div>
          <p className=" text-lg font-semibold capitalize">{convo?.name}</p>
          <p className=" opacity-70 text-sm ">
            {convo?.lastMessage?.content
              ? `${decryptMessage(convo?.lastMessage?.content).slice(0, 40)} ${
                  decryptMessage(convo?.lastMessage?.content).length > 40
                    ? "..."
                    : ""
                } `
              : "Dare to Chat."}
          </p>
        </div>
      </div>
    </Link>
  );
};
