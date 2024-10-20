'use client'

import ImageReact from '@/app/components/ImageReact'
import LikeCommentDiv from '@/app/components/LikeCommentDiv'
import MainLoader from '@/app/components/MainLoader'
import Navbar from '@/app/components/Navbar'
import { likeAnimationHandler } from '@/helper/likeAnimation'
import { useCheckUserStatus } from '@/Hooks/useCheckUserStatus'
import { likePost, PostInterFace, setSinglePostdata, SinglePostType, usePostData } from '@/redux/slices/PostSlice'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { UserDataInterface } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import useOpenModalWithHTML from '@/utils/OpenModalWithHtml'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PiSealCheckDuotone } from 'react-icons/pi'
import { useDispatch } from 'react-redux'





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
                image: singlePostdata.image,
                whenCreated: singlePostdata.whenCreated

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
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession()
    const [likeIds, setLikeIds] = useState<string[]>([])
    const checkUserStatus = useCheckUserStatus()

    // console.log(singlePost)



    const callModalFn = useOpenModalWithHTML()


    const seeFullSizeHandler = (e: any, ele: PostInterFace) => {
        e?.stopPropagation();

        const innerHtml = <div className=' flex flex-col items-center justify-center '>
            <ImageReact
                src={ele?.author?.profilePic}
                className=' rounded '
            />
            <button
                className=' capitalize text-xs px-4 py-2 rounded-md bg-green-500 my-2'
                onClick={() => {
                    router.push(`/user/${ele.author._id}`);
                }}
            >See, {ele?.author?.username || "Name Kumar"}'s profile</button>
        </div>

        callModalFn({ innerHtml })

        // dispatch(setInnerHTMLOfModal(innerHtml))
    }

    const postDoubleClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {



        e.stopPropagation();

        if (!checkUserStatus("Plese login to Like post.")) return
        if (!session?.user?.id) return


        // // // This code will show animation --------->>
        if (!likeIds.includes(session?.user?.id.toString())) {
            likeAnimationHandler(`${e.clientX - 40}px`, `${e.clientY - 50}px`)
        }

        // // // This will handle like fn() -------------->>
        dispatch(likePost({
            postId: singlePost._id,
            userId: session?.user?.id
        }))

    };


    useEffect(() => {
        if (singlePost.likesId.length > 0) {
            let idsOflikes = singlePost.likesId.map((ele: any) => {

                if (typeof ele === "string") {
                    return ele
                } else {
                    return ele?._id
                }
            })
            setLikeIds(idsOflikes)
        }

    }, [])


    return (

        <div
            className={` sm:my-[5vh] rounded-lg  p-2 sm:p-4 w-[95%] sm:w-[80%] md:w-[60%] sm:border border-yellow-500  `}
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

            {/* User name and user info div here ---------->> */}
            <div
                className="rounded-t flex items-center gap-1.5 border-b border-cyan-400 hover:cursor-pointer"
                onClick={(e) => {
                    seeFullSizeHandler(e, singlePost);
                    // console.log(singlePost.author)
                }}
            >
                <ImageReact
                    className={` aspect-square object-cover mt-[3px] rounded-full w-8 border p-[1px] border-[${singlePost?.customize?.color}] `}
                    src={`${singlePost?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                    style={{ borderColor: singlePost?.customize?.color }}
                    alt=""
                />

                <div className=" mt-1">
                    <p className="  capitalize underline font-semibold">{singlePost?.author?.username || "Name Kumar"}</p>
                    <p className=" text-[0.6rem] -mt-[0.5vh]">{singlePost?.author?.email || "xyz100@gmail.com"}</p>
                </div>

            </div>


            {/* Image or Text main content of Post div ------------->> */}
            <div
                className=' py-5 min-h-40'
                onDoubleClick={(e) => postDoubleClickHandler(e)}
            >


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
                        className=' rounded my-2 w-full max-h-[70vh] object-contain'
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


            {/* Like and Comment Div (Component called) ----------->> */}
            <div className=' py-5'>
                <LikeCommentDiv post={singlePost} />
            </div>


        </div>

    )
}


