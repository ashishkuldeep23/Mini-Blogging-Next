import { MdDelete } from "react-icons/md";
import ImageReact from "../../ImageReact";
import Link from "next/link";
import {
  getChatStroryById,
  PutChatStory,
  sendMsgPostCall,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { useUserState } from "@/redux/slices/UserSlice";
import { Chat_User, IChatStory, TypeSendMsg } from "@/types/chat-types";
import { useEffect, useState } from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { likeAnimationHandler } from "@/helper/likeAnimation";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { LuSend } from "react-icons/lu";
import { setCloseMoadal } from "@/redux/slices/ModalSlice";

// // gotoDmClickHandler fn also used as checker is story is open by creator or other user ------>>
// // deleteClickHandler will only come for own chat story.   ----->>
const SingleChatStoryModalDiv = ({
  story,
  gotoDmClickHandler,
  deleteClickHandler,
  usedInChat = false,
}: {
  story: IChatStory;
  gotoDmClickHandler?: () => void;
  deleteClickHandler?: () => void;
  usedInChat?: boolean;
}) => {
  const onlineUsers = useChatData().onlineUsers;
  const userId = useUserState().userData._id;
  const onlineFriendsIdes = Object.values(onlineUsers)
    .filter((user) => user.isOnline === true && user.friends.includes(userId))
    .map((u) => u?._id);

  const isOnline = onlineFriendsIdes.includes(story?.author?._id);

  const storyPostedDateAndTime = new Date(story?.createdAt)?.toLocaleTimeString(
    "en-IN",
    { hour: "2-digit", minute: "2-digit" }
  );

  const [replyText, setReplyText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const likedByArr = story?.likedBy?.map((u) => {
    if (typeof u === "string") {
      return u;
    } else {
      return u?._id;
    }
  });

  const [isLiked, setIsLiked] = useState<boolean>(
    likedByArr?.includes(userId) || false
  );

  const onChangeReplyTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };

  const onSubmitReplyHandler = () => {
    // setReplyText("")

    console.log("Now call dispatch.");

    let makeBodyData: TypeSendMsg = {
      conversationId: "",
      sender: story?.author?._id,
      content: replyText,
      messageType: "text",
      chatStoryId: story?._id,
    };

    // if (updatingMsg?.isUpdating && updatingMsg?.replyTo) {
    //   makeBodyData = {
    //     ...makeBodyData,
    //     replyTo: updatingMsg?.replyTo,
    //   };
    // }

    // // // Final Call to send message to server -------->>
    dispatch(sendMsgPostCall(makeBodyData));

    setReplyText("");
    dispatch(setCloseMoadal());
  };

  const storyLikeHandler = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    if (
      !story?.likedBy
        ?.map((u) => (typeof u === "string" ? u : u?._id))
        .includes(userId)
    ) {
      likeAnimationHandler(`${e.clientX - 40}px`, `${e.clientY - 50}px`);
    }

    setIsLiked(!isLiked);

    // console.log("Now call dispatch for like and unLike.");

    dispatch(
      PutChatStory({
        userId: userId,
        chatStoryId: story?._id,
        likeUpdate: true,
      })
    );
  };

  useEffect(() => {
    // console.log("story", story);

    // if (
    //   story?._id &&
    //   story?.seenBy &&
    //   story?.seenBy?.length > 0 &&
    //   typeof story.seenBy[0] === "string"
    // ) {
    //   // // // now call the actual dispatch to get all data ----->>

    //   dispatch(getChatStroryById(story?._id));
    // }

    // // // calling seen by form here ------------->>

    let seenByUserIds = story?.seenBy?.map((u) => {
      if (typeof u === "string") {
        return u;
      } else {
        return u?._id;
      }
    });

    if (
      !seenByUserIds?.includes(userId) &&
      story?.author?._id !== userId &&
      usedInChat === false
    ) {
      dispatch(
        PutChatStory({
          userId: userId,
          chatStoryId: story?._id,
          seenUpdate: true,
        })
      );
    }
  }, []);

  const hoursLeft = Math.max(
    0,
    Math.floor(
      (new Date(story?.expiresAt).getTime() - new Date().getTime()) /
        (1000 * 60 * 60)
    )
  );

  // console.log(new Date(story?.expiresAt).toString());
  // console.log({ hoursLeft });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center justify-center min-h-[30vh] relative "
    >
      <p
        style={{ lineBreak: "anywhere" }}
        className=" text-center text-3xl font-semibold my-2"
      >
        {story?.text}
      </p>
      <div className=" flex gap-3">
        <span className=" text-xs">by</span>
        <Link className=" flex gap-1" href={`/user/${story?.author?._id}`}>
          <ImageReact
            src={story?.author?.profilePic}
            className=" h-5 w-5 rounded-full object-cover"
          />
          <p className=" capitalize">{story?.author?.username}</p>
        </Link>
      </div>
      <span className=" text-[0.5rem] ">
        {" "}
        At :- {storyPostedDateAndTime}{" "}
        {hoursLeft > 0 && (
          <span className=" text-blue-400 ml-1 font-semibold ">
            ({hoursLeft} H Left)
          </span>
        )}
      </span>

      {gotoDmClickHandler && (
        <>
          <div className="flex gap-0.5 justify-center my-2 rounded-md bg-slate-800 p-0.5 w-[70%] ">
            <input
              value={replyText}
              onChange={onChangeReplyTextHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmitReplyHandler();
                }
              }}
              className=" rounded-md bg-gray-700 w-[100%] px-1  "
              type="text"
            />
            {replyText ? (
              <button
                onClick={onSubmitReplyHandler}
                className=" font-semibold rounded-md  px-2 to-gray-200 "
              >
                <LuSend />
              </button>
            ) : (
              <span className=" ml-1 text-2xl " onClick={storyLikeHandler}>
                {isLiked ? <FcLike /> : <FcLikePlaceholder />}
                {/* {likedByArr && likedByArr.includes(userId) ? (
                  <FcLike />
                ) : (
                  <FcLikePlaceholder />
                )} */}
              </span>
            )}
          </div>
          {/* <p>Make this flow letter</p> */}
          {isOnline && (
            <button
              onClick={gotoDmClickHandler}
              className=" text-xs px-4 py-2 rounded-md bg-green-500 my-2 active:scale-75 transition-all "
            >
              See DM
            </button>
          )}
        </>
      )}

      {/* When you is seening their own story. Yaha pr chahiye story with all data like seenBy and liked by users */}

      {deleteClickHandler && (
        <>
          <div className=" my-2 rounded-md min-h-[10vh] max-h-[20vh] w-full relative overflow-x-hidden overflow-y-auto ">
            {story?.seenBy && story?.seenBy.length > 0 && (
              <p className=" text-[0.5rem] border-b border-gray-600">
                Seen By {story?.seenBy?.length}{" "}
              </p>
            )}

            {/* {true && (
              <span className=" animate-pulse font-bold text-xs ">
                Getting...
              </span>
            )} */}

            {/* Liked By people will come first ------>> */}
            {story?.likedBy &&
              story?.likedBy?.length > 0 &&
              story?.likedBy?.map((user, i) => (
                <SingleSeenOrLikedByDiv key={i} user={user} isLiked={true} />
              ))}

            {/* Then seen by people will come first ------>> */}

            {story?.seenBy &&
              story?.seenBy.length > 0 &&
              // typeof story.seenBy[0] !== "string" &&
              story?.seenBy
                .filter(
                  (user) =>
                    typeof user === "object" && !likedByArr?.includes(user?._id)
                )
                .map((user, i) => (
                  <SingleSeenOrLikedByDiv key={i} user={user} />
                ))}
          </div>

          <button
            className=" absolute bottom-0 right-0 rounded-md hover:bg-red-200 active:scale-75 transition-all text-red-500 border-1 border-red-500"
            onClick={deleteClickHandler}
          >
            <MdDelete className=" h-6 w-6 " />
          </button>
        </>
      )}
    </div>
  );
};

export default SingleChatStoryModalDiv;

const SingleSeenOrLikedByDiv = ({
  user,
  isLiked = false,
}: {
  user: Chat_User | string;
  isLiked?: boolean;
}) => {
  if (typeof user === "string") {
    return null;
  }

  return (
    <Link
      className=" flex m-0.5 gap-1 items-center"
      href={`/user/${user?._id}`}
    >
      <ImageReact
        src={user?.profilePic || ""}
        className=" h-5 w-5 rounded-full object-cover"
      />
      <span className=" capitalize">{user?.username || ""}</span>

      {isLiked && (
        <span className=" ">
          <FcLike className=" text-xs" />
        </span>
      )}
    </Link>
  );
};
