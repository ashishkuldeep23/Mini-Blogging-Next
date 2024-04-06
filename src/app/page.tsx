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
import ImageReact from "./components/ImageReact";




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

function AllPostDiv() {

  const allPostData = usePostData().allPost
  const isLoading = usePostData().isLoading

  const dispatch = useDispatch<AppDispatch>()


  async function fetchAllPosts() {

    dispatch(setIsLoading(true))

    dispatch(setErrMsg(""))

    const option: RequestInit = {
      method: "POST",
      cache: 'no-store',
      next: {
        revalidate: 3
      },
    }

    const response = await fetch(`/api/post/all?timestamp=${Date.now()}`, option)
    let json = await response.json();

    // console.log(json)

    if (json.success) {
      dispatch(setAllPosts(json.data))
    } else {
      dispatch(setErrMsg(json.message))
    }

    dispatch(setIsLoading(false))
  }


  useEffect(() => {
    if (allPostData.length <= 1) {

      fetchAllPosts()

      // dispatch(getAllPosts())
    }
  }, [])

  return (

    <div className="card_container relative sm:px-[8vh] mt-16 flex gap-10 p-0.5 flex-wrap justify-center items-start ">

      <MainLoader isLoading={isLoading} />

      {

        allPostData.length > 0
          ?

          allPostData.map((ele, i) => {
            return (
              <Card key={i} ele={ele} />
            )
          })

          : <></>

        // : [null, null, null, null, null, null, null, null, null, null].map((ele, i) => {
        //   return (

        //     <Card key={i} ele={ele} />

        //   )
        // })
      }

    </div>
  )
}

// export default AllPostDiv

function Card({ ele }: { ele: PostInterFace }) {

  const themeMode = useThemeData().mode

  const dispatch = useDispatch()

  const router = useRouter()

  const promptText = ele.promptReturn

  const charactersWant = 90


  function cardClickHadler(postId: string) {

    // console.log(postId)

    dispatch(setSinglePostId(postId))

    router.push(`/post/${postId}`)
  }


  return (
    <div
      onClick={(e) => { e.stopPropagation(); cardClickHadler(ele._id) }}

      style={{ padding: "3px" }}
      className="single_Card bg-gradient-to-tr from-cyan-400  w-72 sm:w-80  sm:p-2 rounded hover:cursor-pointer hover:scale-105 sm:hover:scale-110 transition-all"
    >

      <div className={` p-1 ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>

        <div className="rounded-t flex p-0.5 gap-1.5 items-center border-b border-cyan-400">

          <ImageReact
            className=" rounded-full w-8"
            src={`${ele?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
            alt=""
          />

          <div className=" mt-1">
            <p className=" leading-[0.7rem] capitalize">{ele?.author?.username || "Name Kumar"}</p>
            <p className=" text-[0.6rem]">{ele?.author?.email || "xyz100@gmail.com"}</p>
          </div>

          {
            ele?.author?.isVerified
            &&
            <span className="mr-2 text-sm ">✅</span>
          }
        </div>

        <div className=" flex justify-between flex-wrap gap-1">
          <p className="capitalize">{ele.title}</p>
          <p className=" ml-auto text-xs">:- {ele.category}</p>
        </div>

        <div className=" text-sm"

        // style={{ overflow : "hidden" , textOverflow : "ellipsis", whiteSpace : "balance"}}
        >

          {
            promptText.toString().length > charactersWant ? `${promptText.slice(0, charactersWant)}...` : `${promptText}`

            // promptText
          }

        </div>

        <div className=" flex flex-wrap gap-0.[2px] text-violet-500 font-semibold ">
          {

            (ele.hashthats.length > 0)
            &&
            ele.hashthats.map((hash, i) => {
              return <p className="ml-1.5" key={i}>{hash}</p>
            })
          }
        </div>

        {/* <div className=" flex gap-5 text-xs mt-2">
          <p>{ele.likes} Likes</p>
          <p>{ele.comments.length} Comments</p>
        </div> */}

        <LikeCommentDiv post={ele} />

      </div>

    </div>
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
