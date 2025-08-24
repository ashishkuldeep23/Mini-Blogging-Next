"use client";

import React, { useEffect, useRef, useState } from "react";
import { PostInterFace } from "../../types/Types";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import { useSession } from "next-auth/react";
import useEditAndDelPostFns from "@/Hooks/useEditAndDelPostFns";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { BiPencil } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";
import { getSavedPostData, useUserState } from "@/redux/slices/UserSlice";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const EditPanelForSinglePost: React.FC<{ ele: PostInterFace }> = ({ ele }) => {
  const themeMode = useThemeData().mode;
  const { data: session } = useSession();
  const {
    updatePostHandler,
    deletePostHandler,
    showOptionPanel,
    setShowOptionPanel,
    savePostDeleteHandler,
    divClickHandler,
  } = useEditAndDelPostFns(ele);

  const handleShowPanelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowOptionPanel((p) => !p);
  };
  const optionPanelRef = useRef<HTMLDivElement | null>(null);
  const callModalFn = useOpenModalWithHTML();

  const savePostClickHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (session && ele?.savedById?.includes(session?.user?._id)) {
      savePostDeleteHandler(ele._id);
    } else {
      const innerHtml = <SavingPostComponent post={ele} />;
      callModalFn({ innerHtml });
    }
  };

  // console.log(showOptionPanel);

  // if (!showOptionPanel) return <></>;

  // // // Hide option panel on click outside --------->>

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (!showOptionPanel) return;

      if (
        // !showOptionPanel &&
        optionPanelRef?.current &&
        !optionPanelRef?.current.contains(e.target as Node)
      ) {
        setShowOptionPanel(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, []);

  if (!showOptionPanel)
    return (
      <button
        className=" ml-auto mt-2 px-2 rounded-md py-1 active:scale-75 transition-all absolute z-[1] top-8 right-2.5"
        onClick={handleShowPanelClick}
      >
        <PiDotsThreeOutlineVertical />
      </button>
    );

  return (
    <div>
      {!showOptionPanel ? (
        <button
          className=" ml-auto mt-2 px-2 rounded-md py-1 active:scale-75 transition-all absolute z-[1] top-8 right-2.5"
          onClick={handleShowPanelClick}
        >
          <PiDotsThreeOutlineVertical />
        </button>
      ) : (
        <div
          className={` flex flex-col items-end gap-1 w-full min-h-40 px-2 py-2  ${
            !themeMode ? " bg-black text-white " : " bg-white text-black "
          } transition-all
        absolute  left-0 z-[2]  ${showOptionPanel ? "top-0" : " -top-[110%] "}
        `}
          style={{
            backgroundColor: ele?.customize?.bgColor || "",
          }}
          onClick={divClickHandler}
          ref={optionPanelRef}
        >
          <button
            className=" text-sm ml-auto mt-2 bg-red-600 px-1.5 py-0.5 rounded-md font-bold active:scale-75 transition-all"
            onClick={handleShowPanelClick}
          >
            ✕
          </button>

          {ele?.author?.email === session?.user?.email && (
            <>
              <button
                className=" text-lg px-2 py-1 border rounded-xl active:scale-75 transition-all hover:bg-green-500 w-[50%]  flex justify-center items-center gap-1 "
                onClick={updatePostHandler}
              >
                <BiPencil />
                <span>Edit</span>
              </button>
              <button
                className=" text-lg px-2 py-1 border rounded-xl active:scale-75 transition-all hover:bg-red-500 w-[60%] flex justify-center items-center gap-1 "
                onClick={deletePostHandler}
              >
                <AiTwotoneDelete />
                <span>Delete</span>
              </button>
            </>
          )}

          <button
            className={`text-lg px-2 py-1 border rounded-xl active:scale-75 transition-all w-[70%] ${
              session &&
              ele?.savedById?.includes(session?.user?._id) &&
              " bg-blue-500 text-white "
            } `}
            onClick={savePostClickHandler}
          >
            <span>Save</span>
          </button>
          <button className=" text-lg px-2 py-1 border rounded-xl active:scale-75 transition-all w-[60%] ">
            <span>Block</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditPanelForSinglePost;

const SavingPostComponent: React.FC<{ post: PostInterFace }> = ({ post }) => {
  const [saveKey, setSaveKey] = useState<string>("savePost");
  const themeMode = useThemeData().mode;

  const userData = useUserState().userData;
  const dispatch = useDispatch<AppDispatch>();

  const { savePostHandler } = useEditAndDelPostFns(post);

  const finalSavePostHandler = (key: string) => {
    savePostHandler(key);
  };

  useEffect(() => {
    if (userData?.savedPost && Object.keys(userData.savedPost).length <= 0) {
      // // // now call api that gets all post data for user.

      dispatch(getSavedPostData());
    }
  }, [userData]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className=" p-5 w-full flex flex-col items-center justify-center gap-2"
    >
      <h1 className=" text-2xl font-bold ">Saving Post...</h1>

      {userData?.savedPost && Object.keys(userData?.savedPost).length > 0 && (
        <div className=" w-full flex flex-wrap gap-2 justify-center items-center flex-col my-4 ">
          {Object.keys(userData?.savedPost).map((key, i) => {
            return (
              <button
                key={i}
                className={` w-full px-5 py-1 rounded-md text-lg flex justify-between items-center capitalize font-bold active:scale-75 transition-all ${
                  saveKey === key
                    ? " bg-blue-500 text-white"
                    : " bg-slate-200 text-black"
                }`}
                onClick={() => finalSavePostHandler(key)}
              >
                <span>{key}</span>
                <span>
                  <CiCirclePlus />
                </span>
              </button>
            );
          })}
        </div>
      )}

      <input
        className={` w-[100%] border rounded-md text-xl px-1 ${
          !themeMode ? " bg-slate-900 text-white" : " bg-slate-100 text-black"
        }`}
        type="text"
        value={saveKey === "savePost" ? "" : saveKey}
        placeholder="Enter a new folder name."
        onChange={(e) => setSaveKey(e.target.value)}
      />

      <button
        className=" px-4 py-2 bg-blue-500 rounded-md text-white"
        onClick={() => finalSavePostHandler(saveKey)}
      >
        {`Save`}
        {saveKey === "savePost" || saveKey === "" ? (
          <span className=" text-sm font-semibold ml-1">Post</span>
        ) : (
          <span className=" text-sm font-semibold ml-1"> at {saveKey}</span>
        )}
      </button>
    </div>
  );
};
