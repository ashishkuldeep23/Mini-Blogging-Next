"use client";

import ImageReact from "@/app/components/ImageReact";
import LikeCommentDiv from "@/app/components/LikeCommentDiv";
import MainLoader from "@/app/components/LoaderUi";
import Navbar from "@/app/components/Navbar";
import VideoPlayer from "@/app/components/VideoPlayer";
import { formatDateToDDMMYYYY } from "@/helper/DateFomater";
import { likeAnimationHandler } from "@/helper/likeAnimation";
import useEditAndDelPostFns from "@/Hooks/useEditAndDelPostFns";
import { useCheckUserStatus } from "@/Hooks/useCheckUserStatus";
import {
  likePost,
  setSinglePostdata,
  usePostData,
} from "@/redux/slices/PostSlice";
import { useThemeData } from "@/redux/slices/ThemeSlice";
// import { UserDataInterface } from '@/redux/slices/UserSlice'
import { AppDispatch } from "@/redux/store";
import { PostInterFace, SinglePostType } from "../../../../types/Types";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import { MdZoomOutMap } from "react-icons/md";
import { PiDotsThreeOutlineVertical, PiSealCheckDuotone } from "react-icons/pi";
import { useDispatch } from "react-redux";
import EditPanelForSinglePost from "@/app/components/EditPanelForSinglePost";

const Page = ({ params }: any) => {
  const themeMode = useThemeData().mode;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const singlePostdata = usePostData().singlePostdata;

  const [responseMsg, setRespoanceMsg] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchPostData(postId: string) {
    setIsLoading(true);

    const option: RequestInit = {
      cache: "no-store",
    };

    const response = await fetch(`/api/post/${postId}`, option);
    let json = await response.json();

    if (!json.success) {
      setRespoanceMsg(json.message);
    } else {
      // setSinglePost(json.data)
      dispatch(setSinglePostdata(json.data));
    }

    setIsLoading(false);
  }

  useEffect(() => {
    // console.log(params.id)

    if (params && params?.id) {
      fetchPostData(params.id);
    } else {
      // console.log("Now fetch data.")

      toast.error("Please give id of post.");
      router.push("/");
    }
  }, []);

  return (
    <section
      className={`flex min-h-[70vh] flex-col items-center sm:gap-5 ${
        !themeMode ? " bg-black text-white " : " bg-white text-black"
      }`}
    >
      {/* <p>{params.id}</p> */}

      <MainLoader isLoading={isLoading} />

      {responseMsg && (
        <p className=" border border-[#f92f60] rounded-lg px-4 py-2 text-xl">
          <span className=" mr-2 border border-[#f92f60] rounded-full size-4 p-0.5">
            ❌
          </span>
          <span className=" border-b">{responseMsg}</span>
        </p>
      )}

      {singlePostdata && singlePostdata._id && (
        // // // See likesId how i'm handling all this, how good i use filter.

        <MainPostUI
          singlePost={{
            ...singlePostdata,
            likesId:
              singlePostdata.likesId.length > 0 &&
              typeof singlePostdata.likesId[0] !== "string"
                ? singlePostdata.likesId.filter(
                    (post) => typeof post !== "string"
                  )
                : [],
          }}
        />
      )}
    </section>
  );
};

export default Page;

function MainPostUI({ singlePost }: { singlePost: SinglePostType }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const [likeIds, setLikeIds] = useState<string[]>([]);
  const checkUserStatus = useCheckUserStatus();
  const callModalFn = useOpenModalWithHTML();

  const seeFullSizeHandler = (e: any, ele: PostInterFace) => {
    e?.stopPropagation();

    const innerHtml = (
      <div className=" flex flex-col items-center justify-center ">
        <ImageReact
          src={ele?.author?.profilePic}
          className=" rounded max-h-[70vh] "
        />
        <button
          className=" capitalize text-xs px-4 py-2 rounded-md bg-green-500 my-2"
          onClick={() => {
            router.push(`/user/${ele.author._id}`);
          }}
        >
          See, {ele?.author?.username || "Name Kumar"}'s profile
        </button>
      </div>
    );

    callModalFn({ innerHtml });

    // dispatch(setInnerHTMLOfModal(innerHtml))
  };

  const postDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (!checkUserStatus("Plese login to Like post.")) return;
    if (!session?.user?.id) return;

    // // // This code will show animation --------->>
    if (!likeIds.includes(session?.user?.id.toString())) {
      likeAnimationHandler(`${e.clientX - 40}px`, `${e.clientY - 50}px`);
    }

    // // // This will handle like fn() -------------->>
    dispatch(
      likePost({
        postId: singlePost._id,
        userId: session?.user?.id,
      })
    );
  };

  useEffect(() => {
    if (singlePost.likesId.length > 0) {
      let idsOflikes = singlePost.likesId.map((ele: any) => {
        if (typeof ele === "string") {
          return ele;
        } else {
          return ele?._id;
        }
      });
      setLikeIds(idsOflikes);
    }
  }, [singlePost]);

  const [zoomImg, setZoomImg] = useState<boolean>(false);

  const zoomImageHandler = () => {
    setZoomImg((p) => !p);
  };

  return (
    <div
      className={` sm:my-[5vh] rounded-lg  p-2 sm:p-4 w-[95%] sm:w-[80%] sm:border border-yellow-500 overflow-hidden relative max-w-[100vw] `}
      style={{
        backgroundColor: singlePost?.customize?.bgColor,
        color: singlePost?.customize?.color,
        // backgroundImage: singlePost?.customize?.bgImage,
        backgroundImage: `${
          singlePost?.image &&
          `url('${singlePost.author?.profilePic}')` ===
            `${singlePost?.customize?.bgImage}`
            ? ""
            : `${singlePost?.customize?.bgImage}`
        }`,
        fontFamily: `${singlePost?.customize?.font} , sans-serif`,
        borderColor: singlePost?.customize?.color || "#eab308", // // // Now border is also following color theme.

        // // // added more style if user choosed profile pic as bg of post ------>
        backgroundRepeat:
          `url('${singlePost.author?.profilePic}')` ===
          `${singlePost?.customize?.bgImage}`
            ? "repeat-y"
            : "",
        backgroundPositionX:
          `url('${singlePost.author?.profilePic}')` ===
          `${singlePost?.customize?.bgImage}`
            ? "center"
            : "",
        backgroundSize:
          `url('${singlePost.author?.profilePic}')` ===
          `${singlePost?.customize?.bgImage}`
            ? "contain"
            : "",
      }}
    >
      {/* Edit and Options panel ------>> */}
      <EditPanelForSinglePost ele={singlePost} />

      {/* User info div */}
      <div className="text-xl font-bold relative flex items-center border-b border-inherit ">
        <div
          className="rounded-t flex items-start p-0.5 gap-1.5  border-cyan-400"
          onClick={(e) => {
            seeFullSizeHandler(e, singlePost);
            e.stopPropagation();
          }}
        >
          <ImageReact
            className={`mt-2 rounded-full  w-8 h-8 scale-[1.65] aspect-square !object-cover border p-[1px] border-[${singlePost?.customize?.color}] `}
            src={`${
              singlePost?.author?.profilePic ||
              "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"
            }`}
            style={{
              borderColor: singlePost?.customize?.color,
            }}
            alt=""
          />

          <div
            className={`mt-1 rounded-br-2xlll pr-4 pl-8 -ml-5 relative `}
            style={{
              borderColor: singlePost?.customize?.color || "",
            }}
          >
            <p className="  capitalize ">
              {singlePost?.author?.username || "Name Kumar"}
            </p>
            <p className=" text-[0.6rem] -mt-[1.5vh]">
              {singlePost?.author?.email || "xyz100@gmail.com"}
            </p>

            {singlePost?.author?.isVerified && (
              <span className="mr-2 mt-2.5 text-green-500 absolute -top-1.5 -right-4 ">
                <PiSealCheckDuotone />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Image or Text main content of Post div ------------->> */}
      <div
        className=" py-5 min-h-40"
        onDoubleClick={(e) => postDoubleClickHandler(e)}
      >
        <div className=" flex justify-between flex-wrap gap-1">
          <p className="capitalize">{singlePost.title}</p>
          <p className=" ml-auto text-xs">({singlePost.category})</p>
        </div>

        <div className=" text-sm  overflow-x-auto overflow-y-hidden scrooller_bar_small">
          {singlePost.promptReturn}
        </div>

        <div className="  overflow-hidden ">
          {/* Here we need to impove, when we will deal with video to. */}
          {singlePost?.image ? (
            <div className=" relative">
              <ImageReact
                src={singlePost?.image}
                className={`w-full h-auto  my-2 rounded object-top ${
                  !zoomImg
                    ? " !object-contain max-h-[70vh] "
                    : " !object-cover "
                } transition-all duration-300 `}
              />
              <MdZoomOutMap
                className=" absolute bottom-4 right-2 text-xl active:scale-75 transition-all "
                onClick={zoomImageHandler}
              />
              <p className=" text-[0.5rem] -mt-2 text-end">
                Click to see full image.
              </p>
            </div>
          ) : (
            singlePost?.metaDataUrl && (
              <>
                {singlePost?.metaDataType &&
                singlePost?.metaDataType === "video/mp4" ? (
                  <VideoPlayer
                    videoUrl={singlePost.metaDataUrl}
                    height="70vh"
                    postData={singlePost}
                    observerOn={true}
                    // playPauseToggleBtn={true}
                  />
                ) : singlePost.metaDataType === "image/jpeg" ||
                  singlePost.metaDataType === "image/png" ? (
                  <div className=" relative ">
                    <ImageReact
                      className={`w-full h-auto  my-2 rounded object-top ${
                        !zoomImg
                          ? " !object-contain max-h-[70vh] "
                          : " !object-cover"
                      } transition-all duration-300 `}
                      src={singlePost.metaDataUrl}
                    />
                    <MdZoomOutMap
                      className=" absolute bottom-4 right-2 text-xl active:scale-75 transition-all "
                      onClick={zoomImageHandler}
                    />
                  </div>
                ) : (
                  <p className=" text-5xl text-white">Nope</p>
                )}
              </>
            )
          )}
        </div>

        <p className=" text-[0.6rem] mt-0 text-end">
          Uploaded on :{" "}
          {singlePost?.updatedAt
            ? formatDateToDDMMYYYY(singlePost?.updatedAt)
            : `${singlePost.whenCreated || "Date"}`}
        </p>

        <div className=" flex flex-wrap gap-0.[2px] text-violet-500 font-semibold ">
          {singlePost.hashthats.length > 0 &&
            singlePost.hashthats.map((hash, i) => {
              return (
                <p className="ml-1.5" key={i}>
                  {hash}
                </p>
              );
            })}
        </div>
      </div>

      {/* Like and Comment Div (Component called) ----------->> */}
      <div className=" py-5">
        <LikeCommentDiv post={singlePost} />
      </div>
    </div>
  );
}
