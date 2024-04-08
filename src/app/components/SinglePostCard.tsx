'use client'

import { PostInterFace, setSinglePostId } from "@/redux/slices/PostSlice"
import { useThemeData } from "@/redux/slices/ThemeSlice"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import ImageReact from "./ImageReact"
import LikeCommentDiv from "./LikeCommentDiv"


import { CardBody, CardContainer, CardItem } from "@/app/components/ui/3d_card";
import Image from "next/image"



export default function SinglePostCard({ ele }: { ele: PostInterFace }) {


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

      style={{ padding: "2px" }}
      className=" bg-gradient-to-tr from-cyan-400  sm:w-80  sm:p-2 rounded-xl hover:cursor-pointer hover:scale-105 sm:hover:scale-110 transition-all"
    >


      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[20rem] sm:w-[30rem] p-3 sm:p-6 h-auto rounded-xl  border  ">

          <div className={` p-1 ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>


            <CardItem
              translateZ="50"
              translateX={-10}
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              <div className="rounded-t flex items-start p-0.5 gap-1.5  border-cyan-400">

                <ImageReact
                  className="mt-2 rounded-full w-8"
                  src={`${ele?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                  alt=""
                />

                <div className=" mt-1">
                  <p className="  capitalize">{ele?.author?.username || "Name Kumar"}</p>
                  <p className=" text-[0.6rem]">{ele?.author?.email || "xyz100@gmail.com"}</p>
                </div>

                {
                  ele?.author?.isVerified
                  &&
                  <span className="mr-2 text-sm mt-2.5 ">✅</span>
                }
              </div>

            </CardItem>




            <CardItem
              translateZ="120"
              rotateX={10}
              rotateZ={-1}
              className="w-full mt-4"
            >
              <>


                <div className=" flex flex-wrap items-center gap-1">
                  <p className="capitalize">{ele.title}</p>
                  <p className=" ml-[10vh] text-xs">:- {ele.category}</p>
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


              </>

            </CardItem>



            <CardItem
              translateZ={20}
              translateX={20}
              as="button"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >

              <LikeCommentDiv post={ele} />

            </CardItem>


          </div>

        </CardBody>
      </CardContainer>




    </div>
  )
}