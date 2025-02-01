import { setSinglePostId } from '@/redux/slices/PostSlice';
import { useThemeData } from '@/redux/slices/ThemeSlice';
import { PostInterFace } from '@/Types'
import useOpenModalWithHTML from '@/utils/OpenModalWithHtml';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import ImageReact from './ImageReact';
import VideoPlayer from './VideoPlayer';
import { MdZoomOutMap } from 'react-icons/md';
import LikeCommentDiv from './LikeCommentDiv';
import { PiSealCheckDuotone } from 'react-icons/pi';

const SinglePostCardNew: React.FC<{ ele: PostInterFace, className?: string, index?: number }> = ({ ele, className, index }) => {


    const themeMode = useThemeData().mode;
    const dispatch = useDispatch();
    const router = useRouter();
    const promptText = ele.promptReturn;
    const charactersWant = 90;

    const [height, setHeight] = useState<"h-[70vh]" | "h-[43vh]">("h-[43vh]")

    function cardClickHadler() {

        dispatch(setSinglePostId(ele._id))
        router.push(`/post/${ele._id}`)
    }

    // console.log(ele)
    const callModalFn = useOpenModalWithHTML();

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
                    router.push(`/user/${ele.author._id}`)
                }}
            >See, {ele?.author?.username || "Name Kumar"}'s profile</button>
        </div>

        callModalFn({ innerHtml })

        // dispatch(setInnerHTMLOfModal(innerHtml))
    }


    const zoomImageHandler = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
        e.stopPropagation();
        setHeight((p) => p === "h-[70vh]" ? "h-[43vh]" : "h-[70vh]")
    }


    return (
        <div
            onClick={(e) => { e.stopPropagation(); cardClickHadler() }}
            className={` sm:rounded-xl lg:my-7 sm:bg-gradient-to-tr from-cyan-400  sm:p-0.5  hover:cursor-pointer transition-all ${className}`}
        >
            <div className="inter-var">
                <div
                    className={` sm:rounded-xl w-[95vw] sm:w-[23rem] md:w-[25rem] lg:w-[27rem] !max-w-[30rem] bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]  dark:border-white/[0.2] border-black/[0.1] h-auto  ${!themeMode ? " dark:bg-black shadow-cyan-950 " : " dark:bg-white shadow-cyan-50 "}   `}
                >

                    <div
                        className={` sm:rounded-xl p-2 py-5 sm:p-4  border-y ${!themeMode ? " bg-black text-white border-slate-700 shadow-slate-700 " : " bg-white text-black border-slate-300 shadow-slate-300"} ${index === 0 && " border-t-0 "}`}
                        style={{
                            backgroundColor: ele?.customize?.bgColor || '',
                            color: ele?.customize?.color || '',
                            backgroundImage: `${(ele?.image && (`url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}`)) ? "" : `${ele?.customize?.bgImage}`}`,
                            fontFamily: `${ele?.customize?.font} , sans-serif`,

                            // // // added more style if user choosed profile pic as bg of post ------>
                            backgroundRepeat: `url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}` ? "no-repeat" : "",
                            backgroundPosition: `url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}` ? 'center' : "",
                            backgroundSize: `url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}` ? "cover" : "",
                        }}
                    >

                        {/* User info div */}
                        <div
                            className="text-xl font-bold "
                        >
                            <div
                                className="rounded-t flex items-start p-0.5 gap-1.5  border-cyan-400"
                                onClick={(e) => { seeFullSizeHandler(e, ele); e.stopPropagation(); }}

                            >

                                <ImageReact
                                    className={`mt-2 rounded-full  w-8 h-8 scale-[1.65] aspect-square !object-cover border p-[1px] border-[${ele?.customize?.color}] `}
                                    src={`${ele?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                                    style={{
                                        borderColor: ele?.customize?.color
                                    }}
                                    alt=""
                                />

                                <div
                                    className={`mt-1 rounded-br-2xl pr-4 pl-6 -ml-3.5 relative border-b `}
                                    style={{
                                        borderColor: ele?.customize?.color || ""
                                    }}
                                >

                                    <p className="  capitalize ">{ele?.author?.username || "Name Kumar"}</p>
                                    <p className=" text-[0.6rem] -mt-[1.5vh]">{ele?.author?.email || "xyz100@gmail.com"}</p>

                                    {
                                        ele?.author?.isVerified
                                        &&
                                        <span className="mr-2 mt-2.5 text-green-500 absolute -top-1 -right-3 ">
                                            <PiSealCheckDuotone />
                                        </span>
                                    }

                                </div>


                            </div>

                        </div>

                        {/* Post info div here  */}
                        <div
                            className={`w-fullll w-[95%] ml-auto py-2 pl-5 border-l border-opacity-50 `}
                            style={{
                                borderColor: ele?.customize?.color || ""
                            }}
                        >
                            {/* <> */}
                            <div className=" my-1 flex flex-wrap items-center gap-1">
                                <p className="capitalize text-xl">{ele.title}</p>
                                {/* <p className=" ml-[75%] text-xs">({ele.category})</p> */}
                            </div>

                            <div className=" my-1 text-sm" >

                                {
                                    promptText.toString().length > charactersWant ? `${promptText.slice(0, charactersWant)}...` : `${promptText}`
                                }

                            </div>

                            {/* Here we need to impove, when we will deal with video to. */}
                            {/* This is modified now, Now we showing video also. */}
                            {
                                ele?.image
                                    ?
                                    <div className=" relative ">
                                        <ImageReact
                                            src={ele?.image}
                                            onClick={(e: any) => { e?.stopPropagation() }}
                                            className={`w-full my-2 rounded !object-top !object-cover transition-all duration-300 ${height} `}
                                        />
                                        <MdZoomOutMap
                                            className=" absolute bottom-2 right-2 text-xl active:scale-75 transition-all "
                                            onClick={zoomImageHandler}
                                        />
                                    </div>

                                    :
                                    ele?.metaDataUrl
                                    &&
                                    <>
                                        {
                                            (ele?.metaDataType && ele?.metaDataType === 'video/mp4')
                                                ?
                                                <div>
                                                    <VideoPlayer
                                                        postData={ele}
                                                        videoUrl={ele.metaDataUrl}
                                                        objectFit={'cover'}
                                                        height='43vh'
                                                        observerOn={true}
                                                        videoClickHandler={() => cardClickHadler()}
                                                    />
                                                </div>
                                                :
                                                (ele.metaDataType === "image/jpeg" || ele.metaDataType === "image/png")
                                                &&
                                                <div className="relative">
                                                    <ImageReact
                                                        className={`w-full my-2 rounded !object-top !object-cover transition-all duration-300 ${height} `}
                                                        src={ele.metaDataUrl}
                                                        onClick={(e: any) => { e?.stopPropagation() }}
                                                    />
                                                    <MdZoomOutMap
                                                        onClick={zoomImageHandler}
                                                        className=" absolute bottom-4 right-2 text-xl active:scale-75 transition-all "
                                                    />
                                                </div>
                                        }
                                    </>
                            }


                            <div className=" w-full flex justify-between items-center px-1">
                                <p className=" text-xs">({ele.category})</p>
                                <p className=" text-[0.6rem] mt-0 text-end">Uploaded on : {ele.whenCreated || "Date"}</p>
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


                            <div
                                className="px-4 py-2 ml-auto md:ml-2 rounded-xl text-xs font-normal "
                            >
                                <LikeCommentDiv post={ele} />
                            </div>


                            {/* </> */}

                        </div>

                        {/* Post like and all here */}
                        {/* <div
                            className="px-4 py-2 ml-auto md:ml-2 rounded-xl text-xs font-normal "
                        >
                            <LikeCommentDiv post={ele} />
                        </div> */}

                    </div>

                </div>
            </div>

        </div>
    )
}

export default SinglePostCardNew
