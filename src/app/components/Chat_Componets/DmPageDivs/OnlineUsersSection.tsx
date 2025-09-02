import useInViewAnimate from "@/Hooks/useInViewAnimate";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { getChatStrories, useChatData } from "@/redux/slices/ChatSlice";
import { useUserState } from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import ImageReact from "../../ImageReact";
import AddChatStoryDiv from "./AddChatStoryDiv";
import SingleChatStory from "./SingleChatStory";
import SingleOnlineUserDiv from "./SingleOnlineUserDiv";

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
          <SingleOnlineUserDiv key={i} story={story} />
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

export default OnlineUsersSection;
