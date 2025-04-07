"use client";
import InfinityScrollWithLogic from "@/app/components/InfinityScrollWithLogic";
import MaskerText from "@/app/components/MaskerText";
import { usePreventSwipe } from "@/Hooks/useSwipeCustom";
import {
  getAllPosts,
  setSearchBrandAndCate,
  usePostData,
} from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import { SearchObj } from "@/Types";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const HomePage = () => {
  return (
    <div className=" text-white w-[100%] relative ">
      <StorySection />
      <AllPostDiv />
      <MaskerText className="font-bold text-2xl" text="I'm Footer dude" />
    </div>
  );
};

export default HomePage;

function AllPostDiv() {
  const { allPost: allPostData, searchHashAndCate, isLoading } = usePostData();

  const dispatch = useDispatch<AppDispatch>();

  // const themeMode = useThemeData().mode;

  let searchObj: SearchObj = {
    hash: "",
    category: "",
    limit: 7,
    page: 1,
  };

  function fetchAllPostData() {
    dispatch(setSearchBrandAndCate(searchObj));
    dispatch(getAllPosts(searchObj));
  }

  function fetchMorePostData() {
    let searchObjMore: SearchObj = {
      ...searchObj,
      page: searchHashAndCate.page + 1,
    };
    dispatch(setSearchBrandAndCate(searchObjMore));
    dispatch(getAllPosts(searchObjMore));
  }

  useEffect(() => {
    // // One bcoz when you refresh the page when u r on single post then it is needed.
    if (allPostData.length <= 1) {
      // // // Before calling all posts we need to set queryObject --------->
      fetchAllPostData();
      // dispatch(getAllPosts())
    }
  }, []);

  return (
    <InfinityScrollWithLogic
      allPostData={allPostData}
      next={fetchMorePostData}
      isLoading={isLoading}
    />
  );
}

function StorySection() {
  // // // Move story by btn ------------->
  // const moveHolderDiv = (where: string) => {
  //   let holderDiv = document.getElementById("story_holder_div")
  //   if (holderDiv) {
  //     holderDiv.scrollBy(100, 100)
  //   }
  // }

  const preventSwipe = usePreventSwipe();

  return (
    <>
      <div
        className="scrooller_bar_small relative w-[98vw] lg:w-full flex  gap-1.5 px-2 items-center justify-start overflow-x-scroll z-[5] lg:max-h-[20vh]"
        {...preventSwipe}
      >
        <div className=" min-w-[15vh] h-[15vh] bg-red-600 m-1 rounded-full flex justify-center items-center">
          <p className=" font-semibold text-center">Your Own </p>
        </div>

        {[null, null, null, null, null, null, null, null].map((_, i) => {
          return (
            <div
              key={i}
              className=" min-w-[15vh] h-[15vh] bg-red-600 m-1 rounded-full flex justify-center items-center"
            >
              <p>{i + 1}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
