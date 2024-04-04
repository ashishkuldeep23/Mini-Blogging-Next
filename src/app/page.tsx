'use client'

import { setModeOnLoad, useThemeData } from "@/redux/slices/ThemeSlice";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PostInterFace, getAllPosts, setAllPosts, setErrMsg, setIsLoading, setSinglePostId, usePostData } from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import MainLoader from "./components/MainLoader";
import MaskerText from "./components/MaskerText";
import { useRouter } from "next/navigation";
import LikeCommentDiv from "./components/LikeCommentDiv";
import AllPostDiv from "./components/AllPostDiv";



export default function Home() {

  const themeMode = useThemeData().mode

  const dispatch = useDispatch<AppDispatch>()

  const allPostData = usePostData().allPost

  // console.log(themeMode)


  return (
    <main className={`flex min-h-screen flex-col items-center gap-10 ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>


      <Navbar />

      <div className=" flex flex-col justify-center items-center py-6 ">


        <div className="flex flex-col items-center ">

          <div className=" px-4 sm:px-10 flex flex-col items-center text-center ">

            <h1 className="text-4xl sm:text-6xl font-bold"
            >
              <MaskerText text={"Discover & Share"} />
            </h1>
            <h1 className="ai_heading text-4xl sm:text-6xl font-bold pb-2"
            >
              <MaskerText text={"AI-Powered Prompts"} />
            </h1>
            {/* <p className="ai_heading font-extrabold"><span>(Mini blogging)</span></p> */}

            <h3
              className=" w-11/12 sm:w-4/6 text-sm sm:text-xl leading-4 sm:leading-6 font-semibold"
            >

              <MaskerText text={"PromptiPedia is an open-surce AI prompting tool form mordern world to discover, create and share creative prompts"} />

              {/* <MaskerText text={""} /> */}

            </h3>

            <input
              type="text"
              className=" text-black p-0.5 px-2 font-bold mt-5 w-11/12 sm:w-4/6 rounded-full shadow-lg shadow-slate-300  border "
              placeholder="Search for prompt here."

            />

          </div>


          <SearchByDiv />


        </div>


        <AllPostDiv />

      </div>

      {
        allPostData.length > 0
        &&
        <FooterDiv />
      }


    </main>
  );
}


const SearchByDiv = () => {

  const [expandCat, setExpandCat] = useState(false)

  const [expandHash, setExpandHash] = useState(false)

  return (

    <>
      <div className=" w-11/12 sm:w-4/6 flex flex-col items-center px-1 sm:px-5  mt-7">

        <div className="w-full flex justify-around flex-wrap">


          <div>
            <p>Search By 👉</p>
          </div>

          <div>
            <p
              className=" border-b hover:cursor-pointer"
              onClick={() => { setExpandCat(!expandCat); setExpandHash(false); }}
            >Category</p>


          </div>

          <div>
            <p
              className=" border-b hover:cursor-pointer"
              onClick={() => { setExpandHash(!expandHash); setExpandCat(false); }}
            >#Hashtags</p>


          </div>

        </div>


        <div
          className={` border mt-2 rounded flex gap-2 flex-wrap justify-around px-1 overflow-hidden ${!expandCat ? " border-0 w-1/2 h-0 opacity-100" : " w-full  opacity-100"} transition-all `}
        >

          {
            ['General', "Tech", "News", "etc", 'General', "Tech", "News", "etc"].map((ele, i) => {
              return <p className=" font-bold text-violet-500 " key={i}>{ele}</p>
            })
          }

        </div>

        <div
          className={` border mt-2 rounded flex gap-2 flex-wrap justify-around px-1 overflow-hidden ${!expandHash ? " border-0 w-1/2 h-0 opacity-100" : " w-full opacity-100"} transition-all `}
        >


          {
            ['#GoogleLogin', "#ReactJs", "#Html", '#CSS', "#TechJobs"].map((ele, i) => {
              return <p className=" font-bold text-violet-500 " key={i}>{ele}</p>
            })
          }
        </div>




      </div>


    </>

  )
}


const FooterDiv = () => {

  return (
    <>
      <div className=" my-7">
        <MaskerText className="font-bold text-3xl" text="I'm Footer dude" />
      </div>
    </>
  )
}
