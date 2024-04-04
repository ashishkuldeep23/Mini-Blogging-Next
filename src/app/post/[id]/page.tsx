'use client'

import ImageReact from '@/app/components/ImageReact'
import LikeCommentDiv from '@/app/components/LikeCommentDiv'
import MainLoader from '@/app/components/MainLoader'
import Navbar from '@/app/components/Navbar'
import { PostInterFace, setSinglePostdata, usePostData } from '@/redux/slices/PostSlice'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { AppDispatch } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'



interface SinglePostData extends PostInterFace {

}


const Page = ({ params }: any) => {

    const themeMode = useThemeData().mode

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()

    const singlePostdata = usePostData().singlePostdata

    const [singlePost, setSinglePost] = useState<SinglePostData>({
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
            isAdmin: false
        },
        likes: 0,
        likesId: [],
        comments: [],
        isDeleted: false
    })

    const [responseMsg, setRespoanceMsg] = useState<string>("")

    const [isLoading, setIsLoading] = useState<boolean>(false)


    async function fetchPostData() {

        setIsLoading(true)

        const option: RequestInit = {
            cache: 'no-store',
        }

        const response = await fetch(`/api/post/${params.id}`, option)
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

        if (!params) {

            toast.error("Please give id of post.")
            router.push("/")

        } else {
            // console.log("Now fetch data.")

            fetchPostData()

        }


    }, [])


    useEffect(() => {


        if (singlePostdata?._id) {

            // console.log(singlePostdata)
            setSinglePost(singlePostdata)
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


function MainPostUI({ singlePost }: { singlePost: SinglePostData }) {

    const themeMode = useThemeData().mode

    return (
        <>

            <div className={` my-[5vh] border border-yellow-500 rounded p-2 w-[95%] sm:w-[80%] md:w-[60%] ${!themeMode ? " bg-black text-white  " : "  bg-white text-black"}`}>

                <div className="rounded-t flex gap-1.5 items-center border-b border-cyan-400">

                    <ImageReact
                        className=" rounded-full w-8"
                        src={`${singlePost?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                        alt=""
                    />
                    <p>{singlePost?.author?.username || "Name Kumar"}</p>

                    {
                        singlePost?.author?.isVerified
                        &&
                        <span className="mr-2 text-sm ">✅</span>
                    }
                </div>

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

                        singlePost.hashthats.length > 0

                            ?

                            singlePost.hashthats.map((hash, i) => {
                                return <p className="ml-1.5" key={i}>{hash}</p>
                            })

                            : <>
                                <p>#promp</p>
                                <p>#ai</p>
                                <p>#write</p>
                            </>
                    }
                </div>

                <LikeCommentDiv post={singlePost} />

            </div>

        </>
    )
}


