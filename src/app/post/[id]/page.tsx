'use client'

import ImageReact from '@/app/components/ImageReact'
import LikeCommentDiv from '@/app/components/LikeCommentDiv'
import MainLoader from '@/app/components/MainLoader'
import Navbar from '@/app/components/Navbar'
import { PostInterFace, setSinglePostdata, usePostData } from '@/redux/slices/PostSlice'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { UserDataInterface } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
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


            let bakeDataHere: any = {
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


                // likesId: singlePostdata.likesId
            }


            if ((singlePostdata.likesId.length > 0) && (typeof singlePostdata.likesId[0] !== "string")) {
                bakeDataHere.likesId = singlePostdata.likesId
            } else {
                bakeDataHere.likesId = []
            }

            setSinglePost(bakeDataHere)
        }


    }, [singlePostdata])



    return (
        <section className={`flex min-h-screen flex-col items-center gap-10 ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>

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

    const themeMode = useThemeData().mode

    const router = useRouter()

    return (
        <>

            <div className={` my-[5vh] border border-yellow-500 rounded p-2 w-[95%] sm:w-[80%] md:w-[60%] ${!themeMode ? " bg-black text-white  " : "  bg-white text-black"}`}>

                <div
                    className="rounded-t flex gap-1.5 items-center border-b border-cyan-400 hover:cursor-pointer"
                    onClick={() => {

                        // console.log(singlePost.author)
                        router.push(`/user/${singlePost.author._id}`);
                    }}
                >

                    <ImageReact
                        className=" rounded-full w-8"
                        src={`${singlePost?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                        alt=""
                    />
                    <p className=' font-semibold capitalize'>{singlePost?.author?.username || "Name Kumar"}</p>

                    {
                        singlePost?.author?.isVerified
                        &&
                        <span className="mr-2 text-sm text-green-500 ">
                            <PiSealCheckDuotone />
                        </span>
                    }
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


