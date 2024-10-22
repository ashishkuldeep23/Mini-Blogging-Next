'use client'
import MainLoader from '@/app/components/MainLoader'
import SinglePostCard from '@/app/components/SinglePostCard'
import { usePreventSwipe } from '@/Hooks/useSwipeCustom'
import { getAllPosts, setSearchBrandAndCate, usePostData } from '@/redux/slices/PostSlice'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { AppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch } from 'react-redux'


const HomePage = () => {
  return (
    <div className=' text-white w-[100%] relative '>

      <StorySection />
      <AllPostDiv />

    </div>
  )
}


export default HomePage


function AllPostDiv() {

  const { allPost: allPostData, isLoading, searchHashAndCate, allPostsLength } = usePostData()

  const dispatch = useDispatch<AppDispatch>()

  const themeMode = useThemeData().mode



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

    <InfiniteScroll
      dataLength={allPostData.length} //This is important field to render the next data
      next={() => {

        if (allPostData.length < allPostsLength && !searchHashAndCate.category && !searchHashAndCate.hash) {
          fetchMorePostData()
        }
      }}

      hasMore={true}
      loader={
        (allPostData.length < allPostsLength && !searchHashAndCate.category && !searchHashAndCate.hash)
        &&
        <div
          className={`lg:-translate-x-[50%] mt-10 flex gap-2 items-center
            ${!themeMode ? "  text-white " : "  text-black"}
          `}
        >
          <span>Getting...</span>
          <span className=" w-4 h-4   rounded-full animate-spin "></span>
        </div>
      }

      className="w-full min-h-[50vh] pt-[1vh] pb-[7vh] px-[2vh] !overflow-auto flex flex-col items-center justify-center"
    >

      <div className="card_container mt-10 lg:ml-10 p-0.5 relative sm:px-[8vh] flex gap-10 gap-x-64 flex-wrap justify-center lg:justify-start items-center ">

        <MainLoader
          isLoading={isLoading}
          // isLoading={true}
          className=" lg:-translate-x-[50%]"
        />

        {

          allPostData.length > 0
          &&

          allPostData.map((ele, i) => {
            return (
              <SinglePostCard key={i} ele={ele} className=" hover:z-10" />
            )
          })



          // : [null, null, null, null, null, null, null, null, null, null].map((ele, i) => {
          //   return (

          //     <Card key={i} ele={ele} />

          //   )
          // })
        }

      </div>

    </InfiniteScroll>

  )
}


function StorySection() {


  // // // Move story by btn ------------->
  // const moveHolderDiv = (where: string) => {

  //   let holderDiv = document.getElementById("story_holder_div")

  //   if (holderDiv) {

  //     holderDiv.scrollBy(100, 100)

  //   }
  // }


  const preventSwipe = usePreventSwipe()


  return (
    <>

      <div
        className='scrooller_bar_hidden relative w-[98vw] lg:w-full flex lg:flex-wrap gap-1.5 px-2 items-center justify-start overflow-x-scroll z-[5] lg:max-h-[20vh]'
        {...preventSwipe}
      >

        <div
          className=' aspect-square h-[14vh] bg-red-600 m-1 rounded-full flex justify-center items-center'
        >
          <p className=' font-semibold text-center'>Your Own </p>
        </div>

        {
          [null, null, null, null, null].map((ele, i) => {
            return (
              <div
                key={i}
                className=' aspect-square h-[14vh] bg-red-600 m-1 rounded-full flex justify-center items-center'
              >
                <p
                // className='font-semibold text-center text-5xl'
                >{i + 1}</p>
              </div>
            )
          })
        }


        {/* <div className=' bg-fuchsia-500 w-full'>


          <button
            onClick={() => moveHolderDiv("forword")}
            className='  top-[30%] right-2 text-4xl'
          >{">"}</button>
          <button
            className='  top-[30%] left-2 text-4xl'
            onClick={() => moveHolderDiv("forword")}
          >{"<"}</button>
        </div> */}

      </div>

    </>
  )

}
