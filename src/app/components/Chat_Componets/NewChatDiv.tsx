"use client";

import {
  getProfileData,
  // getUserData,
  setUserDataBySession,
  useUserState,
} from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageReact from "../ImageReact";
import { FriendsAllFriendData } from "@/types/Types";
import { Conversation, ThemeConvo } from "@/types/chat-types";
import toast from "react-hot-toast";
import useMediaCheckHook from "@/helper/checkMedia";
import { useRouter } from "next/navigation";
import { PostFileInCloudinary } from "@/lib/cloudinaryHandlers";
import MainLoader from "../LoaderUi";

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
  const userId = useUserState()?.userData?._id;

  useEffect(() => {
    if (session) {
      let user = session.user;
      dispatch(setUserDataBySession({ ...user }));
    }

    // // // get user data by api (All Data) ----------->
    if (session?.user._id && !userId) {
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

        {/* Create new Group Div */}
        <CreateNewGroupDiv showNewGroupDiv={showNewGroupDiv} />

        {/* All Friends Div */}
        <div
          className={`max-h-[80%] overflow-y-auto flex flex-col gap-1.5 transition-all duration-500 ease-in-out overflow-hidden ${
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
                  <span className="  w-10 h-10  p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
                    <ImageReact
                      className=" w-[99%] h-[99%] rounded-full object-cover"
                      src={friend?.profilePic || ""}
                    />
                  </span>

                  <div>
                    <p className=" capitalize text-lg font-semibold">
                      {friend?.username}
                    </p>
                    <p className=" opacity-70 text-sm ">Start chatting...</p>
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

type ConversationInput = {
  type: "direct" | "group";
  participants: string[];
  adminOnly: boolean;
  admins: string[];
  name?: string;
  avatar?: string;
  theme?: ThemeConvo;
  description?: string;
  tested?: boolean;
};

const CreateNewGroupDiv = ({
  showNewGroupDiv,
}: {
  showNewGroupDiv: boolean;
}) => {
  const friends = useUserState()?.userData?.friendsAllFriend;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const {
    checkMediaHnadler,
    isLoading: mediaCheckLoading,
    mediaCheck,
    reasons: mediaReasons,
  } = useMediaCheckHook();

  function fileInputOnchangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    // // // Check this letter why not getting below val from env

    if (e.target.files) {
      const file = e?.target?.files[0];

      // // // Here now set file ---------->
      // File size should less then 2 mb.
      let maxFileSize = 16007152;
      if (file.size > maxFileSize) {
        return toast.error("File size should less then 12 mb");
      }

      // // // Set variable here -------->>
      setImageFile(file);
      // setPostImageUrl(URL.createObjectURL(file));

      setNewGroupData({
        ...newGroupData,
        avatar: URL.createObjectURL(file),
      });

      // setMetaDataType(file.type as ValidInputFiles);

      // // // Experiment ---------------------------------------->>
      // // // Now call the check fn defined in server.

      checkMediaHnadler(file);
    }
  }

  const initialConversation: ConversationInput = {
    name: "",
    avatar:
      "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1756146327/xzp8tpeum1yhpvk5eie6.jpg",
    type: "group",
    adminOnly: false,
    admins: [],
    participants: [],
    description: "",
    tested: true,
  };

  const [newGroupData, setNewGroupData] =
    useState<ConversationInput>(initialConversation);
  const [errMsg, setErrMsg] = useState("");

  // const onchangeHandler = () => {
  // };

  const adminClickHandler = (
    friend: FriendsAllFriendData,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (newGroupData.admins.includes(friend._id)) {
      const filterArr = newGroupData.admins.filter((id) => id !== friend._id);
      setNewGroupData({
        ...newGroupData,
        admins: filterArr,
      });
    } else {
      setNewGroupData({
        ...newGroupData,
        admins: [...newGroupData.admins, friend._id],
      });
    }
  };
  const addMemberClickHandler = (
    friend: FriendsAllFriendData,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (newGroupData.participants.includes(friend._id)) {
      const filterArr = newGroupData.participants.filter(
        (id) => id !== friend._id
      );
      setNewGroupData({
        ...newGroupData,
        participants: filterArr,
      });
    } else {
      setNewGroupData({
        ...newGroupData,
        participants: [...newGroupData.participants, friend._id],
      });
    }
  };

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async () => {
    // // // validate all ------>>
    try {
      if (!session?.user._id) {
        toast.error("Plese login again.");
        router.push("/login");
        return;
      } else if (!newGroupData.name) {
        setErrMsg("Name of group is required");
        return;
      } else if (newGroupData.participants.length < 1) {
        setErrMsg("Group should have at least 1 members");
        return;
      }
      // else if (newGroupData.admins.length < 0) {
      //   setErrMsg("Group should have at least 1 admin");
      //   return;
      // }

      setIsLoading(true);

      let groupAvatar = newGroupData.avatar;

      if (imageFile) {
        groupAvatar = await PostFileInCloudinary(imageFile);

        // console.log({ groupAvatar });

        setNewGroupData({
          ...newGroupData,
          avatar: groupAvatar,
        });
      }

      const res = await fetch("/api/chat/conversation/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newGroupData,
          avatar: groupAvatar,
          tested: mediaCheck,
        }),
      });
      const json = await res.json();
      const { _id } = json?.data;
      if (_id) {
        router.push(`/msgs/${_id}`);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={` ${!showNewGroupDiv ? " h-0" : " h-[55vh]"} ${
        isLoading && "opacity-50"
      } w-full rounded-md bg-green-950 transition-all duration-500 ease-in-out overflow-hidden  flex flex-col gap-1.5  items-center `}
    >
      <MainLoader isLoading={isLoading} />

      <div>
        <div className=" flex gap-2 justify-center my-2 p-1 ">
          <div className=" min-w-20 h-20 rounded-full bg-sky-500 ">
            <div className=" w-[100%] h-full">
              <input
                className={` hidden`}
                type="file"
                name=""
                accept="image/png, image/png, image/jpeg, video/mp4"
                id="change_img"
                onChange={(e) => {
                  fileInputOnchangeHandler(e);
                }}
              />

              <label htmlFor="change_img">
                <span className=" min-w-20 h-20 rounded-full overflow-hidden">
                  <ImageReact
                    className="
                  min-w-20 h-20 rounded-full object-cover  "
                    src={newGroupData.avatar || ""}
                  />
                </span>
              </label>
            </div>
          </div>
          <div className=" flex flex-col gap-1 w-full justify-center items-start ">
            <input
              className=" rounded-md bg-gray-700 p-2 py-1"
              placeholder=" Group Name"
              type="text"
              name=""
              id=""
              value={newGroupData.name}
              onChange={(e) => {
                setNewGroupData({ ...newGroupData, name: e.target.value });
              }}
            />
            <textarea
              style={{ resize: "none" }}
              className=" rounded-md bg-gray-700 p-2 py-1 min-h-10 w-full "
              placeholder=" Group Description"
              name=""
              id=""
              value={newGroupData.description}
              onChange={(e) => {
                setNewGroupData({
                  ...newGroupData,
                  description: e.target.value,
                });
              }}
            ></textarea>
          </div>
        </div>

        <div className=" flex flex-col gap-1 ">
          <div className=" flex justify-between p-1">
            <p>Add Members</p>
            <p>{newGroupData.participants.length + 1} </p>
          </div>
          <div className=" flex flex-col gap-1 max-h-44 overflow-y-auto p-1 ">
            {friends &&
              friends.map((friend) => {
                return (
                  <div
                    key={friend._id}
                    className={`overflow-hidden  bg-green-950 text-white  rounded w-full flex items-center hover:cursor-pointer  `}
                    onClick={(e) => addMemberClickHandler(friend, e)}
                  >
                    <span className="  w-7 h-7  p-[0.1rem] rounded-full mr-1 border-2 border-sky-500 overflow-hidden">
                      <ImageReact
                        className=" w-[99%] h-[99%] rounded-full object-cover"
                        src={friend?.profilePic || ""}
                      />
                    </span>

                    <div>
                      <p className=" capitalize text-lg font-semibold">
                        {friend?.username}
                      </p>
                    </div>

                    <div className=" ml-auto mr-1">
                      {newGroupData.participants.includes(friend._id) && (
                        <button
                          onClick={(e) => adminClickHandler(friend, e)}
                          className={` text-xs border px-1 rounded font-semibold border-green-500 active:scale-75 transition-all ${
                            !newGroupData.admins.includes(friend._id)
                              ? " text-white bg-green-500 "
                              : " text-green-500 "
                          } `}
                        >
                          {!newGroupData.admins.includes(friend._id)
                            ? "Admin"
                            : "UnDo"}
                        </button>
                      )}
                      <button
                        className={`ml-2 text-xs border px-1 rounded font-semibold border-blue-500 active:scale-75 transition-all  ${
                          !newGroupData.participants.includes(friend._id)
                            ? " text-white bg-blue-500 "
                            : " text-blue-500 "
                        } `}
                      >
                        {!newGroupData.participants.includes(friend._id)
                          ? "Add"
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className=" mt-2 flex items-center gap-4 justify-center ">
          <p className=" text-base font-semibold">Only Admin send Messages</p>
          <div className=" flex items-center gap-0.5">
            <input
              type="radio"
              name="adminOnly"
              value="true"
              id="radio_yes"
              checked={newGroupData.adminOnly === true}
              onChange={(e) => {
                setNewGroupData({
                  ...newGroupData,
                  adminOnly: e.target.value === "true",
                });
              }}
            />
            <label htmlFor="radio_yes" className=" text-sm font-semibold">
              Yes
            </label>
          </div>
          <div className=" flex items-center gap-0.5">
            <input
              type="radio"
              name="adminOnly"
              value="false"
              id="radio_no"
              checked={newGroupData.adminOnly === false}
              onChange={(e) => {
                setNewGroupData({
                  ...newGroupData,
                  adminOnly: e.target.value === "true",
                });
              }}
            />
            <label htmlFor="radio_no" className=" text-sm font-semibold">
              No
            </label>
          </div>
        </div>

        <div>
          {imageFile && !mediaCheckLoading && !mediaCheck && (
            <div className=" text-center text-red-500 border rounded-xl  p-2 flex flex-col ">
              <p className=" text-sm font-semibold ">
                Your media could not be validated by our system. Please ensure
                it meets the required guidelines and try again.
              </p>
              {mediaReasons?.length > 0 && (
                <div className=" flex gap-1 justify-center mt-2 ">
                  <p>Reasons:</p>
                  {mediaReasons.map((ele, i) => {
                    return <span key={i}>{ele}</span>;
                  })}
                </div>
              )}

              <div className=" text-white text-sm mt-2 ">
                <p>Check console for more details or Inform Admin</p>
                <p>
                  Plz don't do this, it takes months to create this web app.
                </p>
              </div>
            </div>
          )}
        </div>

        {errMsg && <p className=" text-red-500 text-center">{errMsg}</p>}

        <div>
          <button
            onClick={onSubmitHandler}
            className=" w-full text-center bg-green-600 h-10 my-2 text-xl font-bold rounded-lg px-2 "
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};
