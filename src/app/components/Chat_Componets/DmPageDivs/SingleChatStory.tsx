import {
  CreateConversations,
  setCurrentConvo,
  useChatData,
} from "@/redux/slices/ChatSlice";
import ImageReact from "../../ImageReact";
import SingleChatStoryModalDiv from "./SingleChatStoryModalDiv";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useUserState } from "@/redux/slices/UserSlice";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import useInViewAnimate from "@/Hooks/useInViewAnimate";
import { IChatStory } from "@/types/chat-types";
import { FcLike } from "react-icons/fc";

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
    // // // now here we can call api readBy
    // // // Don't do this letter -------->> Once reply of chat is done.

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

    const innerHtml = (
      <SingleChatStoryModalDiv
        story={story}
        gotoDmClickHandler={gotoDmClickHandler}
      />
    );

    callModalFn({ innerHtml });
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

export default SingleChatStory;
