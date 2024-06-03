'use client'

import ImageReact from '@/app/components/ImageReact'
import LikeCommentDiv from '@/app/components/LikeCommentDiv'
import MainLoader from '@/app/components/MainLoader'
import Navbar from '@/app/components/Navbar'
import { PostInterFace, setSinglePostdata, usePostData } from '@/redux/slices/PostSlice'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { UserDataInterface } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PiSealCheckDuotone } from 'react-icons/pi'
import { useDispatch } from 'react-redux'


// // // Baking type for single post -------->
export interface SinglePostType extends Omit<PostInterFace, 'likesId'> {
    likesId: UserDataInterface[]
}


const Page = ({ params }: any) => {

    const themeMode = useThemeData().mode

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()

    const singlePostdata = usePostData().singlePostdata


    const initialPostData: SinglePostType = {
        _id: "",
        title: "",
        category: "",
        promptReturn: "",
        urlOfPrompt: "",
        aiToolName: "",
        hashthats: [""],
        image: "",
        author: {
            username: "",
            email: "",
            profilePic: "",
            isVerified: false,
            isAdmin: false,
            _id: ""
        },
        likes: 0,
        likesId: [],
        comments: [],
        isDeleted: false
    }

    const [singlePost, setSinglePost] = useState<SinglePostType>(initialPostData)

    const [responseMsg, setRespoanceMsg] = useState<string>("")

    const [isLoading, setIsLoading] = useState<boolean>(false)


    async function fetchPostData(postId: string) {

        setIsLoading(true)

        const option: RequestInit = {
            cache: 'no-store',
        }

        const response = await fetch(`/api/post/${postId}`, option)
        let data = await response.json();

        if (!data.success) {
            setRespoanceMsg(data.message)
        } else {

            // console.log(data.data)

            setSinglePost(data.data)
            dispatch(setSinglePostdata(data.data))
        }

        setIsLoading(false)
    }


    useEffect(() => {

        // console.log(params.id)

        if (params && params?.id) {


            fetchPostData(params.id)
        } else {
            // console.log("Now fetch data.")

            toast.error("Please give id of post.")
            router.push("/")

        }


    }, [])




    // // // Do this to update single post ---------->
    // // // Very improtant code for single post data update --------->
    useEffect(() => {
        if (singlePostdata && singlePost?._id) {

            let backDataHere: any = {
                _id: singlePostdata._id,
                title: singlePostdata.title,
                category: singlePostdata.category,
                promptReturn: singlePostdata.promptReturn,
                urlOfPrompt: singlePostdata.urlOfPrompt,
                aiToolName: singlePostdata.aiToolName,
                hashthats: singlePostdata.hashthats,
                author: singlePostdata.author,
                likes: singlePostdata.likes,
                comments: singlePostdata.comments,
                isDeleted: singlePostdata.isDeleted,
                customize: singlePostdata.customize,
                image: singlePostdata.image

                // likesId: singlePostdata.likesId
            }


            if ((singlePostdata.likesId.length > 0) && (typeof singlePostdata.likesId[0] !== "string")) {
                backDataHere.likesId = singlePostdata.likesId
            } else {
                // // // Empty arr for some cases used when post got updated and ------->
                backDataHere.likesId = []
            }

            setSinglePost(backDataHere)
        }


        // console.log(singlePostdata)
    }, [singlePostdata])



    return (
        <section className={`flex min-h-screen flex-col items-center sm:gap-5 ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>

            {/* <p>{params.id}</p> */}

            <Navbar />

            <MainLoader isLoading={isLoading} />



            {
                responseMsg
                &&
                <p className=' border border-[#f92f60] rounded-lg px-4 py-2 text-xl'>
                    <span className=' mr-2 border border-[#f92f60] rounded-full size-4 p-0.5'>❌</span>
                    <span className=' border-b'>{responseMsg}</span>
                </p>
            }


            {/* {
                // JSON.stringify(singlePost)
            } */}


            {
                singlePost._id
                &&

                <MainPostUI singlePost={singlePost} />
            }



        </section>
    )
}

export default Page

function MainPostUI({ singlePost }: { singlePost: SinglePostType }) {

    const router = useRouter()

    // console.log(singlePost)

    return (
        <>

            <div
                className={` sm:my-[5vh] sm:border rounded p-2 w-[95%] sm:w-[80%] md:w-[60%] border-yellow-500 `}
                style={{
                    backgroundColor: singlePost?.customize?.bgColor,
                    color: singlePost?.customize?.color,
                    // backgroundImage: singlePost?.customize?.bgImage,
                    backgroundImage: `${(singlePost?.image && (`url('${singlePost.author?.profilePic}')` === `${singlePost?.customize?.bgImage}`)) ? "" : `${singlePost?.customize?.bgImage}`}`,
                    fontFamily: `${singlePost?.customize?.font} , sans-serif`,
                    borderColor: singlePost?.customize?.color || "#eab308",    // // // Now border is also following color theme.


                    // // // added more style if user choosed profile pic as bg of post ------>
                    backgroundRepeat: `url('${singlePost.author?.profilePic}')` === `${singlePost?.customize?.bgImage}` ? "repeat-y" : "",
                    backgroundPositionX: `url('${singlePost.author?.profilePic}')` === `${singlePost?.customize?.bgImage}` ? 'center' : "",
                    backgroundSize: `url('${singlePost.author?.profilePic}')` === `${singlePost?.customize?.bgImage}` ? "contain" : "",
                }}
            >

                <div
                    className="rounded-t flex items-center gap-1.5 border-b border-cyan-400 hover:cursor-pointer"
                    onClick={() => {

                        // console.log(singlePost.author)
                        router.push(`/user/${singlePost.author._id}`);
                    }}
                >
                    <ImageReact
                        className={` mt-[3px] rounded-full w-8 border p-[1px] border-[${singlePost?.customize?.color}] `}
                        src={`${singlePost?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                        style={{ borderColor: singlePost?.customize?.color }}
                        alt=""
                    />

                    <div className=" mt-1">
                        <p className="  capitalize underline font-semibold">{singlePost?.author?.username || "Name Kumar"}</p>
                        <p className=" text-[0.6rem] -mt-[0.5vh]">{singlePost?.author?.email || "xyz100@gmail.com"}</p>
                    </div>

                </div>


                <div className=' py-5 min-h-40'>


                    <div className=" flex justify-between flex-wrap gap-1">
                        <p className="capitalize">{singlePost.title}</p>
                        <p className=" ml-auto text-xs">({singlePost.category})</p>
                    </div>

                    <div className=" text-sm"
                    >

                        {
                            singlePost.promptReturn
                        }
                    </div>


                    {
                        singlePost && singlePost?.image
                        &&
                        <ImageReact
                            style={{ objectFit: "cover" }}
                            className=' rounded my-2 w-full'
                            src={singlePost?.image}
                        />

                    }

                    <p className=" text-[0.6rem] mt-2 text-end">Uploaded on : {singlePost.whenCreated || "Date"}</p>

                    <div className=" flex flex-wrap gap-0.[2px] text-violet-500 font-semibold ">
                        {

                            (singlePost.hashthats.length > 0)
                            &&
                            singlePost.hashthats.map((hash, i) => {
                                return <p className="ml-1.5" key={i}>{hash}</p>
                            })

                        }
                    </div>

                </div>

                <div className=' py-5'>
                    <LikeCommentDiv post={singlePost} />
                </div>


            </div>

        </>
    )
}


