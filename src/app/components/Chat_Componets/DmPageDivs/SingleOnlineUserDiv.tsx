import { Chat_User, IChatStory } from "@/types/chat-types";
import ImageReact from "../../ImageReact";
import useInViewAnimate from "@/Hooks/useInViewAnimate";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  CreateConversations,
  setCurrentConvo,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { useRouter } from "next/navigation";
import { useUserState } from "@/redux/slices/UserSlice";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import SingleChatStoryModalDiv from "./SingleChatStoryModalDiv";
import { FcLike } from "react-icons/fc";
import { useEffect, useState } from "react";

const SingleOnlineUserDiv = ({
  user,
  story,
}: {
  user?: Chat_User;
  story?: IChatStory;
}) => {
  const { ref, inView } = useInViewAnimate();
  const dispatch = useDispatch<AppDispatch>();
  const callModalFn = useOpenModalWithHTML();
  const allDirectConvoIds = useChatData().allConversations.filter(
    (e) => e?.type === "direct"
  );
  // .map((e) => e?._id);
  const onlineUsers = useChatData().onlineUsers;
  const ownUserId = useUserState().userData._id;
  const onlineFriendsIdes = Object.values(onlineUsers)
    .filter(
      (user) => user.isOnline === true && user.friends.includes(ownUserId)
    )
    .map((u) => u?._id);

  const router = useRouter();
  const userId = user?._id || story?.author?._id || "";
  const isOnline = onlineFriendsIdes.includes(userId);

  const gotoDmClickHandler = () => {
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
  };

  const onlineClickHandler = () => {
    if (story) {
      const innerHtml = (
        <SingleChatStoryModalDiv
          story={story}
          gotoDmClickHandler={gotoDmClickHandler}
        />
      );

      callModalFn({ innerHtml });
    } else {
      gotoDmClickHandler();
    }
  };

  // console.log(JSON.stringify(story, null, 2));

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const likedByArr = story?.likedBy?.map((u) => {
      if (typeof u === "string") {
        return u;
      } else {
        return u?._id;
      }
    });

    // console.log(likedByArr);

    setIsLiked(likedByArr?.includes(ownUserId) || false);
  }, [story?.likedBy]);

  return (
    <div
      // ref={(e) =>{}}
      ref={ref as React.LegacyRef<HTMLDivElement>}
      className={` min-w-20 group rounded-md  flex flex-col  justify-end items-center p-1 m-0 active:scale-75 hover:cursor-pointer transition-all relative
    ${inView ? "animate__animated animate__jackInTheBox " : ""}
    `}
      onClick={onlineClickHandler}
    >
      {story && (
        <span
          className={`flex gap-0.5 absolute -top-1  ${
            isLiked ? " pl-4 " : " pl-0 "
          } `}
        >
          <span className="  border-2 border-gray-500 rounded-md px-1 py-0.5 z-[5] text-[0.5rem] bg-black flex  ">
            {story?.text
              ? story?.text?.length > 25
                ? `${story?.text?.slice(0, 25)}...`
                : story?.text
              : "Add Note"}
          </span>
          {isLiked && <FcLike />}
        </span>
      )}

      <span className="relative  active:scale-90 transition-all  ">
        <ImageReact
          src={user?.profilePic || story?.author?.profilePic || ""}
          className=" h-16 w-16 rounded-full object-cover  "
        />

        {isOnline && (
          <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-1 right-1 "></span>
        )}
      </span>

      <p className=" text-[0.5rem]  text-center  leading-[0.6rem] capitalize ">
        {user?.username || story?.author?.username || "Name"}
      </p>
    </div>
  );
};

export default SingleOnlineUserDiv;
