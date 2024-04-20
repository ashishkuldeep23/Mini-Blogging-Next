'use client'

import { useThemeData } from "@/redux/slices/ThemeSlice";
import Navbar from "./components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllPosts, usePostData, setSearchBrandAndCate } from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import MainLoader from "./components/MainLoader";
import MaskerText from "./components/MaskerText";
import { useRouter } from "next/navigation";
import SinglePostCard from "./components/SinglePostCard";
import { useSession } from "next-auth/react";
// import ThreeDCardDemo from "./components/ui/card";

import { BsFillPatchPlusFill } from "react-icons/bs";
import { debounce } from "@/utils/debounce";
import InfiniteScroll from "react-infinite-scroll-component";
{/* <BsFillPatchPlusFill /> */ }



export default function Home() {

  const { data: session } = useSession()

  const themeMode = useThemeData().mode

  const dispatch = useDispatch<AppDispatch>()

  const allPostData = usePostData().allPost

  const router = useRouter()

  // console.log(themeMode)


  let onFocusFlagForRedirectUser = false

  return (
    <main className={` relative flex min-h-screen flex-col items-center gap-10 ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>

      <Navbar />

      {/* Plus ICon to create post  */}
      {
        session?.user._id

        &&

        <button
          className="add_button_down_right fixed bottom-[8%] sm:bottom-[10%] right-5 sm:right-[4%] text-5xl z-[100] fill-neutral-700 hover:scale-125 focus:scale-90 transition-all"
          onClick={() => { router.push("/new-post") }}
        // style={{ backdropFilter : "drop-shadow(2px 4px 6px cyan)"}}
        >
          <BsFillPatchPlusFill />
        </button>



      }


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
              className={`p-0.5 px-2 font-bold mt-5 w-11/12 sm:w-4/6 rounded-full shadow-lg  border 
                  ${!themeMode ? "text-white bg-black shadow-slate-700 border-slate-700 " : "text-black bg-white shadow-slate-300 border-slate-300 "}
               `}
              placeholder="Search for prompt here."
              onFocus={() => {

                if (!onFocusFlagForRedirectUser) {

                  alert("Now i can redirect user to search page.")
                  onFocusFlagForRedirectUser = true
                }
              }}
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

  const { postCategories, posthashtags, searchHashAndCate } = usePostData()

  const dispatch = useDispatch<AppDispatch>()


  function getDataByCategory(cat: string) {
    let searchObj = { ...searchHashAndCate, category: `${cat}` }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))
  }


  function getDataByHashtag(hash: string) {
    let searchObj = { ...searchHashAndCate, hash: `${hash}` }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))
  }


  function backToNormalHandler() {
    let searchObj = { hash: "", category: "", page: 1 }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))

    setExpandCat(false);
    setExpandHash(false);

  }



  return (

    <>
      <div className=" w-11/12 sm:w-4/6 flex flex-col items-center px-1 sm:px-5  mt-7">

        <div className="w-full flex justify-around flex-wrap">


          <div>
            <p>Search By 👉</p>
          </div>

          <div className=" filter_container  ">
            <p
              className={`  px-1 hover:cursor-pointer ${expandCat && "text-violet-500 font-bold"} transition-all`}
              onClick={() => {
                setExpandCat(!expandCat);
                // setExpandHash(false); 
              }}
            >Category</p>

          </div>

          <div className=" filter_container  ">
            <p
              className={` px-1 hover:cursor-pointer ${expandHash && "text-violet-500  font-bold"} transition-all`}
              onClick={() => {
                setExpandHash(!expandHash);
                // setExpandCat(false);
              }}
            >#Hashtags</p>

          </div>

        </div>


        <div
          className={` border mt-2 rounded flex gap-2 flex-wrap justify-around px-1 overflow-hidden ${!expandCat ? " border-0 w-1/2 h-0 opacity-100" : " w-full  opacity-100"} transition-all  `}
          style={{ transitionDuration: "1.0s" }}
        >

          {

            postCategories.length > 0
            &&
            postCategories.map((ele, i) => {
              return <p
                key={i}
                className=" font-bold text-violet-500 hover:cursor-pointer "
                onClick={() => { getDataByCategory(ele) }}
              >{ele}</p>
            })
          }

        </div>

        <div
          className={` border mt-2 rounded flex gap-2 flex-wrap justify-around px-1 overflow-hidden ${!expandHash ? " border-0 w-1/2 h-0 opacity-100" : " w-full opacity-100"} transition-all `}
          style={{ transitionDuration: "1.0s" }}
        >
          {

            (posthashtags.length > 0)
            &&
            posthashtags.map((ele, i) => {
              return <p
                key={i}
                className=" font-bold text-violet-500 hover:cursor-pointer "
                onClick={() => { getDataByHashtag(ele) }}
              >{ele}</p>
            })
          }
        </div>


        {
          (expandCat || expandHash)
          &&
          <button
            className=" text-xs border border-red-500 text-red-500 my-2 px-2 rounded ml-auto mr-2"
            onClick={() => {
              setExpandCat(false);
              setExpandHash(false);
            }}
          >Close</button>
        }




        {
          (searchHashAndCate.category || searchHashAndCate.hash)
          &&
          <button
            className=" mt-10  text-xs border rounded-md px-2"
            onClick={() => {
              backToNormalHandler()
            }}
          >Back to Default</button>
        }


      </div>
    </>
  )
}


function AllPostDiv() {

  const { allPost: allPostData, isLoading, searchHashAndCate, allPostsLength } = usePostData()

  const dispatch = useDispatch<AppDispatch>()


  // async function fetchAllPosts() {

  //   dispatch(setIsLoading(true))

  //   dispatch(setErrMsg(""))

  //   const option: RequestInit = {
  //     method: "POST",
  //     cache: 'no-store',
  //     next: {
  //       revalidate: 3
  //     },
  //   }

  //   const response = await fetch(`/api/post/all?timestamp=${Date.now()}`, option)
  //   let json = await response.json();

  //   // console.log(json)

  //   if (json.success) {
  //     dispatch(setAllPosts(json.data))
  //   } else {
  //     dispatch(setErrMsg(json.message))
  //   }

  //   dispatch(setIsLoading(false))
  // }



  function fetchAllPostData() {
    let searchObj = { hash: "", category: "", page: 1 }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))

  }


  function fetchMorePostData() {
    let searchObj = { hash: "", category: "", page: searchHashAndCate.page + 1 }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))
  }



  useEffect(() => {
    if (allPostData.length <= 1) {

      // // // Before calling all posts we need to set queryObject --------->

      fetchAllPostData()
      // dispatch(getAllPosts())
    }
  }, [])


  return (

    <>

      <InfiniteScroll
        dataLength={allPostData.length} //This is important field to render the next data
        next={() => {

          if (allPostData.length < allPostsLength) {
            fetchMorePostData()
          }
        }}

        hasMore={true}
        loader={
          (allPostData.length < allPostsLength)
          &&

          <div className=" mt-10 flex gap-2 items-center">
            <span>LOADING...</span>
            <span className=" w-4 h-4   rounded-full animate-spin "></span>
          </div>
        }

        className="w-[98vw] min-h-[50vh] !overflow-auto flex flex-col items-center justify-center"

      >


        <div className="card_container mt-10 relative sm:px-[8vh] flex gap-10 gap-x-64 p-0.5 flex-wrap justify-center items-start ">

          <MainLoader
            isLoading={isLoading}
          // className="top-0" 
          />

          {

            allPostData.length > 0
              ?

              allPostData.map((ele, i) => {
                return (
                  <SinglePostCard key={i} ele={ele} />
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

      </InfiniteScroll>


    </>

  )
}

// export default AllPostDiv

const FooterDiv = () => {

  const { isLoading, searchHashAndCate, allPost: allPostData, allPostsLength } = usePostData()

  const dispatch = useDispatch<AppDispatch>()


  const footerDivRef = useRef<HTMLDivElement>(null)


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

      {/* {
        (isLoading && searchHashAndCate.page > 1)
        &&
        (allPostData.length < allPostsLength)
        &&
        <div className=" mt-10 flex gap-2 items-center">
          <span>LOADING</span>
          <span className=" w-4 h-4   rounded-full animate-spin "></span>
        </div>

      } */}

      <div
        className=" mb-7 mt-2"
        ref={footerDivRef}
      >
        <MaskerText className="font-bold text-3xl" text="I'm Footer dude" />
      </div>
    </>
  )
}
