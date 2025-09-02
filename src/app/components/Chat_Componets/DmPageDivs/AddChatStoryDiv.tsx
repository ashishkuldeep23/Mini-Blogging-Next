import {
  DeleteChatStory,
  PostChatStory,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { setCloseMoadal } from "@/redux/slices/ModalSlice";
import { useUserState } from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import SingleChatStoryModalDiv from "./SingleChatStoryModalDiv";

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

  if (!userId) return <></>;

  if (findChatStory)
    return (
      <SingleChatStoryModalDiv
        story={findChatStory}
        deleteClickHandler={() => {
          dispatch(DeleteChatStory(findChatStory?._id));
          dispatch(setCloseMoadal());
        }}
      />
    );
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center w-full bg-black text-white rounded p-2"
    >
      <p className="text-center">Add note for your friends for 24 hour.</p>
      <input
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submitHandler()}
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

export default AddChatStoryDiv;
