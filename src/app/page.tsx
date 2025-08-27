"use client";

import { useThemeData } from "@/redux/slices/ThemeSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllPosts,
  setSearchBrandAndCate,
  usePostData,
} from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import MaskerText from "./components/MaskerText";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import MainLoader from "./components/LoaderUi";

export default function Home() {
  const router = useRouter();
  const themeMode = useThemeData().mode;
  const allPostData = usePostData().allPost;
  const isLoading = usePostData().isLoading;
  const dispatch = useDispatch<AppDispatch>();

  function fetchAllPostData() {
    let searchObj = { hash: "", category: "", page: 1 };
    dispatch(setSearchBrandAndCate(searchObj));
    dispatch(getAllPosts(searchObj));
  }

  useEffect(() => {
    if (allPostData.length <= 1) {
      // // // Before calling all posts we need to set queryObject --------->
      fetchAllPostData();
      // dispatch(getAllPosts())
    }
  }, []);

  return (
    <main
      className={` relative flex min-h-screen flex-col items-center ${
        !themeMode ? " bg-black text-white " : " bg-white text-black"
      }`}
    >
      {/* Loading animation on landing page. */}
      <MainLoader isLoading={isLoading} className=" !top-[85vh]" />

      {/* Now i'm going to user pusher ------> */}
      {/* Pusher working code -----------> */}
      {/* <PusherTestDiv
        channelName='ashish'
      /> */}

      {/* Main home div that hold allPosts and all */}
      <div className=" flex flex-col justify-center items-center ">
        <Navbar />

        <div className=" relative flex items-start  gap-5">
          <div className=" w-[100%]">
            <div className="flex flex-col items-center ">
              <FeatureDetailShowHomeFirstTime />
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          className=" border rounded px-2 focus:scale-90"
          onClick={() => router.push("/home")}
        >
          Home
        </button>
      </div>

      {allPostData.length > 0 && <FooterDiv />}
    </main>
  );
}

function FeatureDetailShowHomeFirstTime() {
  const [firstTime, setFirstTime] = useState("");

  const router = useRouter();

  // // // This code was responsiable for show and hide feature section.
  useEffect(() => {
    let chcekAlreadyVisited = localStorage.getItem("alreadyVisited");

    if (chcekAlreadyVisited) {
      chcekAlreadyVisited = JSON.parse(chcekAlreadyVisited);

      if (chcekAlreadyVisited) {
        setFirstTime(chcekAlreadyVisited);
        router.push("/home");
      }
    }

    localStorage.setItem("alreadyVisited", JSON.stringify("yes"));
  }, []);

  return (
    <>
      <div
        className={`
      px-4 mb-7 sm:px-10 flex flex-col items-center text-center 
      transition-all duration-700 scale-100 !h-auto mt-10
       
        `}
      >
        <h1 className="text-4xl sm:text-6xl font-bold">
          <MaskerText text={"Discover & Share"} />
        </h1>
        <h1 className="ai_heading text-4xl sm:text-6xl font-bold pb-2">
          <MaskerText text={"AI-Powered Prompts"} />
        </h1>
        {/* <p className="ai_heading font-extrabold"><span>(Mini blogging)</span></p> */}

        <h3 className=" w-11/12 sm:w-4/6 text-sm sm:text-xl leading-4 sm:leading-6 font-semibold">
          <MaskerText
            text={
              "PromptiPedia is an open-surce AI prompting tool form mordern world to discover, create and share creative prompts"
            }
          />

          {/* <MaskerText text={""} /> */}
        </h3>
      </div>

      <div
        className={` flex flex-col items-center mb-2 ${
          firstTime ? " scale-100 !h-auto " : " scale-0 !h-0 "
        } transition-all duration-700 `}
      >
        <p className=" text-2xl font-semibold text-center ">
          Latest posts are 👇
        </p>
        <button
          className="  text-xs px-4 border rounded-2xl"
          onClick={() => {
            // console.log("Clicked ------------>")
            // console.log(firstTime)
            setFirstTime("");
          }}
        >
          Show web discription
        </button>
      </div>
    </>
  );
}

const FooterDiv = () => {
  const {
    isLoading,
    searchHashAndCate,
    allPost: allPostData,
    allPostsLength,
  } = usePostData();

  const dispatch = useDispatch<AppDispatch>();

  const footerDivRef = useRef<HTMLDivElement>(null);

  // function fetchAllPostData() {
  //   let searchObj = { hash: "", category: "", page: searchHashAndCate.page + 1 }
  //   dispatch(setSearchBrandAndCate(searchObj))
  //   dispatch(getAllPosts(searchObj))
  // }

  // const handleScroll = () => {
  //   const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
  //   if (bottom && !isLoading) {

  //     // console.log({ bottom })
  //     // console.log("now call here to get more data from backend ------>")
  //     // setPage(prevPage => prevPage + 1);

  //     // console.log(searchHashAndCate)
  //     // console.log(searchHashAndCate.page + 1)

  //     // // // Here fetching data according to page number --------->
  //     // let searchObj = { hash: "", category: "", page: searchHashAndCate.page + 1 }
  //     // dispatch(setSearchBrandAndCate(searchObj))
  //     // dispatch(getAllPosts(searchObj))

  //     fetchAllPostData()

  //   }
  // };

  // useEffect(() => {
  //   // console.log(searchHashAndCate)
  //   const debouncedScrollHandler = debounce(handleScroll, 500);
  //   window.addEventListener('scroll', debouncedScrollHandler);
  //   return () => window.removeEventListener('scroll', debouncedScrollHandler);
  // }, [searchHashAndCate]);

  return (
    <>
      <div className=" mb-7 mt-2" ref={footerDivRef}>
        <MaskerText className="font-bold text-3xl" text="I'm Footer dude" />
      </div>
    </>
  );
};
