'Use client'

import { Comment, PostInterFace, ReplyInterFace, setDeleteSinglePost, setSinglePostdata, setUpdateComment, setUpdatingPost } from '@/redux/slices/PostSlice';
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { Fragment, RefObject, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import ImageReact from "./ImageReact";
import MainLoader from "./MainLoader";
import { FaRegCommentDots } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { AiOutlineRetweet, AiTwotoneDelete } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { UserDataInterface } from '@/redux/slices/UserSlice';
import AnimatedTooltip from './ui/animated-tooltip';

import { PiPaperPlaneRight } from "react-icons/pi";
import { SinglePostType } from '../post/[id]/page';



interface UpdatingComment {
    mode: boolean,
    value: string,
    commentId: string
}


const LikeCommentDiv = ({ post }: { post: PostInterFace | SinglePostType }) => {

    const { data: session, status } = useSession()

    const textAreaInputRef = useRef<HTMLTextAreaElement>(null)

    const params = usePathname()

    const router = useRouter()

    const [showPostCommentDiv, setShowPostCommentDiv] = useState(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [userID, setUserID] = useState<string>("")


    const [updatingComment, setUpdatingComment] = useState<UpdatingComment>({
        mode: false,
        value: "",
        commentId: ""
    })


    const [commentIds, setCommentIds] = useState<string[]>([])

    const [likeIds, setLikeIds] = useState<string[]>([])


    const dispatch = useDispatch<AppDispatch>()


    // const router = useRouter()
    // console.log(status)
    // useEffect(() => {
    //     if ( status === "unauthenticated") {
    //         router.push("/")
    //     }
    // }, [session])


    function checkUserStatus(msg: string) {

        if (!session) {
            toast.error(msg)
            return false
        }
        return true
    }


    const likeClickHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        if (!checkUserStatus("Plese login to Like post.")) return

        // console.log("user id", session?.user?.id)
        // console.log("post id", post._id)

        setIsLoading(true)

        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: post._id, userId: session?.user?.id })
        }
        const response = await fetch('/api/post/like', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            dispatch(setSinglePostdata(json.data))
        }

        else {
            toast.error(json.message)
        }


        // console.log(data)

        setIsLoading(false)

    }


    const commentBtnClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        e.stopPropagation()

        textAreaInputRef.current?.focus()

        setShowPostCommentDiv(true)

        // console.log(textDivRef)
    }


    const reWriteHandler = () => {

        if (!checkUserStatus("Plese login to rewrite post.")) return

        setIsLoading(true)

        setIsLoading(false)
    }


    const updatePostHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()

        // toast.success("Update post")

        // // // All dispatches here -------->
        dispatch(setSinglePostdata(post))
        dispatch(setUpdatingPost(true))


        // // // Page navigation here  -------->
        router.push('/new-post')
        // // // Use with "/" (forword slash) to go somewhere --->
        // router.replace('new-post')
    }


    const deletePostHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()


        setIsLoading(true)

        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: post._id,
                userId: session?.user?.id
            })
        }
        const response = await fetch('/api/post/delete', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            // dispatch(setSinglePostdata(json.data))

            dispatch(setDeleteSinglePost(json.data))

            if (params !== '/') {
                router.push("/")
            }

        }

        else {
            toast.error(json.message)
        }


        // console.log(data)

        setIsLoading(false)

    }


    useEffect(() => {

        if (post.comments.length > 0) {
            let idsOfComments = post.comments.map((ele) => {

                // console.log(typeof ele)

                if (typeof ele === "string") {
                    return ele
                } else {
                    return ele?.userId?._id
                }


            })

            // console.log(idsOfComments)

            setCommentIds(idsOfComments)

        }


        if (post.likesId.length > 0) {
            let idsOflikes = post.likesId.map((ele: any) => {

                // console.log(ele)

                if (typeof ele === "string") {
                    return ele
                } else {
                    return ele?._id
                }


            })

            // console.log(idsOflikes)

            setLikeIds(idsOflikes)

        }


    }, [post])


    useEffect(() => {

        if (session?.user?.id) {
            setUserID(session?.user?.id)
        }

    }, [session])



    // // // Below useEffect is very imp. this decide show rest ui or not ---->
    useEffect(() => {

        // console.log(params)

        // if (params !== "/") {
        //     setShowPostCommentDiv(true)
        // }

    }, [])

    return (
        <div className=' relative'>

            <MainLoader isLoading={isLoading} />


            <div className="mt-2">


                {/* Like comments buttons (all 3 buttons here) -----> */}
                <div className=' pt-3 flex flex-row-reverse items-start md:flex-row gap-8 md:gap-x-16'>

                    <div className='flex gap-2 flex-wrap justify-between flex-row-reverse md:flex-row'>

                        {/* Like btn */}
                        <button
                            className={`  border px-1 rounded-lg flex items-center gap-1 ${likeIds.includes(userID.toString()) && "text-rose-500 border-rose-500 shadow-md shadow-rose-500"} `}
                            onClick={(e) => { e.stopPropagation(); likeClickHandler(e) }}
                        >
                            <span>{post.likes}</span>
                            <span > <SlLike /> </span>
                        </button>


                        {/* comment btn */}
                        <button
                            className={`border px-1 rounded-lg flex items-center gap-1
                            ${commentIds.includes(userID.toString()) && "text-yellow-500 border-yellow-500 shadow-md shadow-yellow-500"}
                        `}
                            onClick={(e) => { e.stopPropagation(); commentBtnClicked(e) }}
                        >
                            <span>{post.comments.length}</span>
                            <span><FaRegCommentDots /> </span>
                        </button>


                        {/* rewrite btn */}
                        <button
                            className=' border px-1 rounded-lg flex items-center gap-1'
                            onClick={(e) => { e.stopPropagation(); reWriteHandler() }}
                        >
                            <span>{post.comments.length}</span>
                            <span><AiOutlineRetweet /> </span>
                        </button>

                    </div>

                    {
                        post?.author?.email === session?.user?.email
                        &&
                        <div className=' ml-auto mr-1 flex gap-0'>

                            <button
                                className=" border px-2 rounded-lg mx-0.5 hover:bg-blue-500"
                                onClick={(e) => { e.stopPropagation(); updatePostHandler(e) }}
                            >
                                <BiPencil />
                            </button>

                            <button
                                className=" border px-2 rounded-lg  mx-0.5 hover:bg-red-500"
                                onClick={(e) => { e.stopPropagation(); deletePostHandler(e) }}
                            >
                                <AiTwotoneDelete />
                            </button>
                        </div>
                    }

                </div>


                {/* Below fragment show only if user on post[id] page --->  */}


                {/* All Likes div ---> */}
                {

                    // // // By below way we can get user on single page route or in other route
                    // // // 'post' is fixed name that is, i'm using to show single post page --------> 
                    // // // By this way ass problems fixed
                    // // // This technique is also used in all comments see below code -->
                    params.includes("post")
                    &&

                    <div className='rounded my-1 p-0.5 py-2 flex gap-2 items-center flex-wrap '>

                        <p className=' flex gap-1 flex-wrap items-center ml-1 -mt-3 '>
                            <span className=' font-semibold'>Likes</span>
                            <span>
                                <PiPaperPlaneRight />
                            </span>
                        </p>


                        <div className=' px-1 flex gap-1 flex-wrap items-center'>

                            {
                                (post.likesId.length > 0)
                                &&

                                (post.likesId[0] !== "string")
                                &&

                                // post.likesId.map((ele) => ele.)

                                <AnimatedTooltip
                                    items={
                                        post.likesId
                                            .map(
                                                (ele: any, i) => (
                                                    {
                                                        id: i,
                                                        name: ele.username,
                                                        designation: ele.email,
                                                        image: ele.profilePic,
                                                        onClickFunction: (() => { router.push(`/user/${ele._id}`); })
                                                    }
                                                )
                                            )
                                    }
                                />

                            }


                        </div>

                    </div>

                }



                {
                    // showPostCommentDiv

                    (params.includes("post") || params.includes("user") || showPostCommentDiv)

                    &&

                    <PostCommentForm
                        textAreaInputRef={textAreaInputRef}
                        checkUserStatus={checkUserStatus}
                        updatingComment={updatingComment}
                        setUpdatingComment={setUpdatingComment}
                        post={post}
                    />

                }


                {
                    // // // In home page this section will show noting jsut a empty tag ----->
                    (post.comments.length > 0)
                    &&
                    params.includes("post")
                    &&
                    <AllComments
                        post={post}
                        updatingComment={updatingComment}
                        setUpdatingComment={setUpdatingComment}
                    />
                }


            </div>
        </div>
    )
}

export default LikeCommentDiv


function PostCommentForm(
    {
        textAreaInputRef,
        checkUserStatus,
        post,
        updatingComment,
        setUpdatingComment

    }: {
        textAreaInputRef: RefObject<HTMLTextAreaElement>,
        checkUserStatus: Function,
        post: PostInterFace | SinglePostType,
        updatingComment: UpdatingComment,
        setUpdatingComment: Function
    }
) {

    const [commentValue, setCommentValue] = useState({
        value: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    const themeMode = useThemeData().mode

    const dispatch = useDispatch<AppDispatch>()

    const { data: session, status } = useSession()


    async function postCommentBtn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        e.stopPropagation()

        // // // Validations ---->

        if (!commentValue.value) return toast.error("Please give comment for this post.")

        if (!checkUserStatus("Please login to give a comment for this post.")) return



        setIsLoading(true)


        const option: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: post._id,
                userId: session?.user?.id,
                comment: commentValue.value
            })
        }
        const response = await fetch('/api/post/comment', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            dispatch(setSinglePostdata(json.data))
            setCommentValue({ value: "" })
        }
        else {
            toast.error(json.message)
        }


        setIsLoading(false)
    }



    async function updateComment(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        e.stopPropagation()

        // // // Validations ---->

        if (!updatingComment.mode) return toast.error("Please click edit icon again.")

        if (!commentValue.value) return toast.error("Please give comment for this post.")

        if (!checkUserStatus("Please login to give a comment for this post.")) return


        // alert(updatingComment.value)



        // // // Send comment id also --->
        // commentId


        setIsLoading(true)

        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: post._id,
                userId: session?.user?.id,
                comment: commentValue.value,
                commentId: updatingComment.commentId
            })
        }
        const response = await fetch('/api/post/comment/update', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            dispatch(setUpdateComment({ comment: json.data, whatUpadate: "update" }))

            // Back to normal everything.
            setUpdatingComment({ mode: false, value: "", commentId: "" })
            setCommentValue({ value: '' })
        } else {
            toast.error(json.message)
        }



        setIsLoading(false)
    }




    useEffect(() => {
        if (updatingComment.mode) {
            setCommentValue({ value: updatingComment.value })
            textAreaInputRef.current?.focus()
            window.scroll(textAreaInputRef?.current?.clientHeight || 110, 0)
        }
    }, [updatingComment])


    return (
        <>
            <div
                className='ml-auto sm:w-[90%] mt-3 flex flex-col relative p-0.5 border border-green-300 my-0.5 px-1 rounded-lg '
                onClick={(e) => { e.stopPropagation(); }}
            >


                <MainLoader isLoading={isLoading} />

                <p className=" ml-1 flex gap-1 flex-wrap items-center ">
                    Give your
                    <span className=" underline">comment</span>
                    here
                    <span className=' rotate-[90deg]'> <PiPaperPlaneRight /> </span>
                </p>


                <div className=" flex flex-wrap items-center">
                    {
                        ["👍", "😍", "😀", "👌", "👎", "Good", 'Nice', "OSM", "Informative", "Bad!", ",", ".", "X"].map((ele, i) => {
                            return (
                                <button
                                    key={i}
                                    className={`border border-l-2 border-b-2 p-0.5 m-0.5 rounded text-xs ${ele === "X" && "ml-2 border-red-500"} `}

                                    onClick={(e) => {
                                        e.stopPropagation();

                                        if (commentValue.value) {

                                            if (ele === "," || ele === ".") {
                                                setCommentValue({ value: `${commentValue.value}${ele}` })
                                            }

                                            else if (ele === "X") {
                                                setCommentValue({ value: `` })
                                            }
                                            else {
                                                setCommentValue({ value: `${commentValue.value} ${ele}` })
                                            }

                                        } else {



                                            if (ele === "X") {
                                                setCommentValue({ value: `` })
                                            }
                                            else {
                                                setCommentValue({ value: `${ele}` })
                                            }

                                        }

                                        if (textAreaInputRef?.current) {
                                            textAreaInputRef.current.scrollTop = textAreaInputRef.current?.scrollHeight
                                        }
                                        // &&

                                    }}

                                >
                                    {

                                        ele === "X"
                                            ? <span className='px-1 font-bold bg-red-500 text-white '>{ele}</span>
                                            : ele
                                    }
                                </button>
                            )
                        })
                    }
                </div>

                <div className="flex">
                    <textarea
                        ref={textAreaInputRef}
                        style={{ resize: "none" }}
                        placeholder="Give your comment here."
                        className={`w-full h-full border rounded px-2 mx-0.5 ${!themeMode ? "bg-black text-white" : "bg-white text-black"} `}
                        value={commentValue.value}
                        onChange={(e) => { e.stopPropagation(); setCommentValue({ value: e.target.value }) }}
                    ></textarea>

                    <button
                        className={`font-bold border rounded px-2 mx-0.5 ${!themeMode ? "bg-green-700 " : "bg-green-300 "} `}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!updatingComment.mode) {
                                postCommentBtn(e)
                            } else {
                                updateComment(e)
                            }
                        }}
                    >
                        {

                            !updatingComment.mode ? "POST" : "Update"
                        }
                    </button>

                </div>

            </div>
        </>
    )
}


function AllComments({
    post,
    updatingComment,
    setUpdatingComment,
}: {
    post: PostInterFace | SinglePostType,
    updatingComment: UpdatingComment,
    setUpdatingComment: Function,
}) {


    const params = usePathname()


    if (!params.includes('post')) {
        return <></>
    }


    return (
        <div
            className=" my-5 mx-0.5 border border-rose-400 rounded-md"
        >

            <div className=' flex justify-center'>
                <p
                    className='border-b border-l-2 rounded-[100%]  mt-5 ml-1 pl-5 pb-1 flex gap-1 flex-wrap items-center justify-center hover:cursor-pointer hover:scale-105 sm:hover:scale-125 transition-all '

                    onClick={() => {
                        window.scroll(0, 300)
                    }}

                >
                    <span>
                        All given comments for this post.
                        <span className=' relative left-2 top-[5px] inline-flex rotate-[90deg]'> <PiPaperPlaneRight /> </span>
                    </span>
                </p>
            </div>


            {
                post.comments.map((comment, i) => <SingleCommentUI
                    post={post}
                    key={i}
                    i={i}
                    length={post.comments.length}
                    comment={comment}
                    updatingComment={updatingComment}
                    setUpdatingComment={setUpdatingComment}
                />)
            }

        </div>
    )

}


const SingleCommentUI = ({
    post,
    comment,
    i,
    length,
    updatingComment,
    setUpdatingComment,
}: {
    post: PostInterFace | SinglePostType,
    comment: Comment,
    i: number,
    length: number
    updatingComment: UpdatingComment,
    setUpdatingComment: Function,
}) => {

    const dispatch = useDispatch()

    const { data: session, status } = useSession()

    const [isLoading, setIsLoading] = useState(false)

    const [commentClicked, setCommentClicked] = useState(false)

    // console.log(session?.user.email)

    const router = useRouter()

    async function likeComment() {
        // alert("Like Comment")

        setIsLoading(true)


        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: post._id,
                userId: session?.user?.id,
                commentId: comment._id

            })
        }
        const response = await fetch('/api/post/comment/like', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            // dispatch(setSinglePostdata(json.data))

            dispatch(setUpdateComment({ comment: json.data, whatUpadate: 'like' }))
        }
        else {
            toast.error(json.message)
        }


        setIsLoading(false)

    }


    function updateSingleComment() {
        setUpdatingComment({ mode: true, value: comment.comment, commentId: comment._id })
    }


    async function deleteSingleComment() {

        setIsLoading(true)

        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: post._id,
                userId: session?.user?.id,
                commentId: comment._id
            })
        }
        const response = await fetch('/api/post/comment/delete', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            dispatch(setUpdateComment({ comment: json.data, whatUpadate: 'delete' }))

        } else {
            toast.error(json.message)
        }

        setIsLoading(false)
    }



    return (

        <>
            <div
                key={comment._id}
                className={` ${i % 2 !== 0 && "ml-auto"} border rounded m-1 my-7 p-0.5 w-[90%] sm:w-[80%] relative z-[1]`}
            >

                {/* <span className=' absolute -top-[2.5vh] right-0 -z-0'>{length - (i)}</span> */}

                <MainLoader isLoading={isLoading} />


                <div className='flex gap-1 items-end justify-between'>


                    <div className="w-[90%] flex flex-col gap-1 ">

                        <div
                            className=" flex gap-1"
                            onClick={() => { router.push(`/user/${comment?.userId?._id}`); }}
                        >

                            <ImageReact
                                className=" border-t-2 w-6 mx-1 my-0.5 rounded-full"
                                src={comment?.userId?.profilePic}
                                alt=""
                            />
                            <p className=" capitalize">{comment?.userId?.username}</p>

                        </div>

                        <div className=" ml-1">

                            <p>{comment.comment}</p>
                        </div>


                        {
                            // // // Edit and delete btns here --------->

                            comment?.userId?.email === session?.user?.email

                            &&

                            <div>

                                <button
                                    className=" border rounded p-1 mx-1 hover:bg-blue-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateSingleComment()
                                    }}
                                >
                                    <BiPencil />

                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteSingleComment }}
                                    className=" border rounded p-1 mx-1 hover:bg-red-500"
                                >
                                    <AiTwotoneDelete />

                                </button>

                            </div>

                        }





                    </div>


                    {/* Like and comment div here -----> */}

                    <div className=" p-0.5 py-1 flex flex-col">

                        <button
                            className={`flex gap-0.5 items-center justify-center mb-1.5 border p-1 rounded text-xs
                                     ${comment?.likesId?.includes(session?.user?.id || "") && "text-rose-500 border-rose-500 shadow-md shadow-rose-500"}
                            `}
                            onClick={(e) => { e.stopPropagation(); likeComment() }}
                        >

                            {/* <span
                        className=" absolute font-semibold text-xs -top-[35%] -right-[15%] "
                    >{comment?.likesId?.length}</span> */}

                            <span>{comment.likes}</span>

                            <SlLike />
                        </button>

                        <button
                            className=" flex gap-0.5 items-center justify-center border p-1 rounded text-xs"
                            onClick={(e) => { e.stopPropagation(); setCommentClicked((last) => !last) }}
                        >
                            {
                                (comment.likes === 0) && (comment.replies.length === 0)
                                    ?
                                    <>
                                        <span>Reply</span>
                                    </>
                                    :
                                    <>
                                        <span>{comment.replies.length}</span>

                                        <FaRegCommentDots />
                                    </>
                            }


                        </button>

                    </div>


                </div>

                {

                    (comment.likes > 0 || comment.replies.length > 0 || commentClicked)
                    &&
                    <SeeMoreOfComment
                        commentClicked={commentClicked}
                        comment={comment}
                        setCommentClicked={setCommentClicked}
                    />
                }


            </div>
        </>

    )
}


function SeeMoreOfComment(
    {
        commentClicked,
        comment,
        setCommentClicked
    }: {
        commentClicked: boolean,
        comment: Comment,
        setCommentClicked: Function
    }
) {

    const router = useRouter()

    const themeMode = useThemeData().mode

    const { data: session, status } = useSession()

    const dispatch = useDispatch<AppDispatch>()

    const [seeMoreBtn, setSeeMoreBtn] = useState(false)

    const replyInputBox = useRef<HTMLInputElement>(null)

    const [replyText, setReplyText] = useState<string>("")

    const [updatingReply, setUpdatingReply] = useState({
        mode: false,
        index: 0,
        id: "",
    })

    const [likedBy, setLikedBy] = useState<UserDataInterface[]>([])

    const [replies, setReplies] = useState<ReplyInterFace[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(false)


    async function getCommentData() {

        if (comment.likesId.length === 0 && comment.replies.length === 0)

            setIsLoading(true)

        const response = await fetch(`/api/post/comment/reply/${comment._id}`)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            // dispatch(setSinglePostdata(json.data))
            // setCommentValue({ value: "" })

            setLikedBy(json.data.likesId)

            setReplies(json.data.replies)

        }
        else {
            toast.error(json.message)
        }
        setIsLoading(false)

    }

    async function submitReplyHandler() {

        if (!replyText) return toast.error("Please give comment for this post.")

        if (!session?.user?.id) return toast.error("Please login to give a comment for this post.")


        setIsLoading(true)

        const option: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: session?.user?.id,
                reply: replyText,
                commentId: comment._id
            })
        }
        const response = await fetch('/api/post/comment/reply', option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            // dispatch(setSinglePostdata(json.data))
            // setCommentValue({ value: "" })

            setReplyText("")
            setLikedBy(json.data.likesId)
            setReplies(json.data.replies)

            // // // Data containing updated comment ----->
            dispatch(setUpdateComment({ comment: json.data, whatUpadate: 'update' }))

        }
        else {
            toast.error(json.message)
        }


        setIsLoading(false)


    }

    async function commentEditHandler(id: string, index: number) {


        if (!replyText) return toast.error("Please give comment for this post.")

        if (!session?.user?.id) return toast.error("Please login to give a comment for this post.")


        setIsLoading(true)

        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: session?.user?.id,
                reply: replyText,
                commentId: comment._id,
                replyId: id,
                index: index
            })
        }
        const response = await fetch(`/api/post/comment/reply/${comment._id}/update`, option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            // dispatch(setSinglePostdata(json.data))
            // setCommentValue({ value: "" })

            setReplyText("")
            setLikedBy(json.data.likesId)
            setReplies(json.data.replies)

            // // // Data containing updated comment ----->
            dispatch(setUpdateComment({ comment: json.data, whatUpadate: 'update' }))



            setUpdatingReply({
                mode: false,
                index: 0,
                id: ''
            });



        }
        else {
            toast.error(json.message)
        }


        setIsLoading(false)



        // // // Back to normal ----->

    }

    async function commentDeleteHandler(id: string, index: number) {

        setIsLoading(true)

        const option: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: session?.user?.id,
                commentId: comment._id,
                replyId: id,
                index: index
            })
        }
        const response = await fetch(`/api/post/comment/reply/${comment._id}/delete`, option)
        let json = await response.json();

        // console.log(json)

        if (json.success) {
            // dispatch(updateOnePost(json.data))
            // dispatch(setSinglePostdata(json.data))
            // setCommentValue({ value: "" })

            setLikedBy(json.data.likesId)
            setReplies(json.data.replies)


            // // // Data containing updated comment ----->
            dispatch(setUpdateComment({ comment: json.data, whatUpadate: 'update' }))

        }
        else {
            toast.error(json.message)
        }


        setIsLoading(false)
    }



    useEffect(() => {

        if (commentClicked) {
            getCommentData()
            setSeeMoreBtn(true)

            // // // now focus input box ---->
            if (replyInputBox.current) {
                replyInputBox.current.focus()
            }


        }
    }, [commentClicked])


    return (
        <>

            <div
                className='flex flex-col'
            >

                <div className=' flex items-center '>

                    <p
                        className=' ml-1'
                    >

                        <span className=' text-xs'>
                            {
                                "-:  "
                            }
                            {
                                comment.whenCreated.toString()
                            }
                        </span>


                    </p>

                    <button
                        className={`relative mt-0.5  ml-auto mr-0 flex gap-0.5 items-center justify-center border p-0.5 rounded text-[0.6rem] font-semibold font-serif ${seeMoreBtn && " bg-yellow-400 text-black "} `}

                        onClick={(e) => {
                            e.stopPropagation();
                            setSeeMoreBtn((last) => !last);
                            // getCommentData();
                            setCommentClicked(true)
                        }}

                    >
                        <span>More</span>

                        {
                            !seeMoreBtn
                                ?
                                <span><IoIosArrowDown /></span>

                                :
                                <span><IoIosArrowUp /></span>
                        }

                    </button>
                </div>


                {/* Main UI here -------> */}
                <div
                    className={` overflow-hidden relative rounded px-1 py-0.5  flex flex-col ${!seeMoreBtn ? " h-1  opacity-100 " : "  h-fit opacity-100"}  transition-all duration-1000 `}
                >

                    <div className=' py-1  my-3 rounded border-y-2'>

                        {/* Suggetion for reply ---------> */}
                        <div className='mt-1 flex justify-between items-center flex-wrap'>

                            <div className=" flex flex-wrap items-center">
                                {
                                    ["👍", "😍", "😀", "👌", "👎", "X"].map((ele, i) => {
                                        return (
                                            <button
                                                key={i}
                                                className={` overflow-hidden text-xs mx-0.5 my-[2px] border border-l-2 border-b-2  rounded  ${ele === "X" && "ml-3 border-red-500 rounded-xl "} `}

                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (replyText) {

                                                        if (ele === "X") {
                                                            setReplyText('')
                                                        }
                                                        else {
                                                            setReplyText(`${replyText} ${ele}`)
                                                        }

                                                    } else {

                                                        if (ele === "X") {
                                                            setReplyText('')
                                                        }
                                                        else {
                                                            setReplyText(`${ele}`)
                                                        }

                                                    }


                                                }}

                                            >{

                                                    ele === "X"
                                                        ? <span className='px-1 font-bold bg-red-500 text-white '>{ele}</span>
                                                        : ele

                                                }</button>
                                        )
                                    })
                                }
                            </div>

                            <p
                                className=' text-xs text-end ml-auto'
                            >
                                {comment.likes} likes and {comment.replies.length} replies.
                            </p>

                        </div>


                        {/* Input for reply -------> */}
                        <div
                            className=' flex flex-wrap flex-col sm:flex-row mt-1 w-full'
                        >
                            <input
                                className={` w-[100%] sm:w-[82%] h-full border rounded px-2 mx-0.5 ${!themeMode ? "bg-black text-white" : "bg-white text-black"} `}
                                type="text"
                                placeholder='Your reply for this comment.'
                                value={replyText}
                                onChange={(e) => { setReplyText(e.target.value) }}
                                ref={replyInputBox}

                            />
                            <button
                                className={`font-semibold  ml-auto md:ml-1 border py-0 text-sm rounded px-1 ${themeMode ? "bg-green-400" : "bg-green-600"}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!updatingReply.mode) {
                                        submitReplyHandler()
                                    } else {
                                        commentEditHandler(updatingReply.id, updatingReply.index)
                                    }
                                }}
                            >
                                {

                                    !updatingReply.mode
                                        ? "Reply"
                                        : "Update"

                                }
                            </button>
                        </div>

                    </div>


                    {

                        // // // Loading UI
                        isLoading
                        &&

                        <span className=' text-center text-xl text-cyan-500 font-bold '>
                            LOADING...
                        </span>
                    }


                    {
                        likedBy.length > 0
                        &&
                        <div className='border rounded my-1 p-0.5 py-2 flex gap-2 items-start flex-wrap '>

                            <p className=' flex gap-1 flex-wrap items-center ml-1 mt-1.5 '>
                                <span className=' font-semibold'>Likes</span>
                                <span> <PiPaperPlaneRight /> </span>
                            </p>


                            <div
                                className='px-1 flex gap-1 flex-wrap items-center'
                            >

                                {

                                    // // // Not using now ------> (uncomment and use it. Old UI )

                                    // likedBy.map((ele, i) => {
                                    //     return (
                                    //         <Fragment key={i}>

                                    //             <div className='border rounded-full pr-2 flex items-center gap-1 w-fit'>

                                    //                 <ImageReact className='w-7 rounded-full border' src={ele?.profilePic} />
                                    //                 <p className='text-xs capitalize'>{ele.username}</p>
                                    //             </div>
                                    //         </Fragment>
                                    //     )
                                    // })
                                }



                                <AnimatedTooltip
                                    items={
                                        likedBy.map((ele, i) => (
                                            {
                                                id: i,
                                                name: ele.username,
                                                designation: ele.email,
                                                image: ele.profilePic,
                                                onClickFunction: (() => { router.push(`/user/${ele._id}`) })
                                            }
                                        ))
                                    }
                                />

                            </div>


                        </div>

                    }



                    {
                        replies.length > 0
                        &&

                        <div className=' rounded my-1 p-0.5'>


                            <p className=' text-center'>
                                <span>Replies are</span>
                                <span className=' relative left-2 top-[5px] inline-flex rotate-[90deg]'> <PiPaperPlaneRight /> </span>
                            </p>

                            {
                                replies.map((ele, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className=' border rounded-full pl-4 sm:pl-1.5 mt-1 w-full flex items-center justify-between flex-wrap gap-0.5 overflow-hidden'
                                        >

                                            <div>

                                                <p>{ele.reply}</p>
                                            </div>


                                            <div className=' ml-auto flex justify-center items-center gap-1 flex-wrap'>


                                                {
                                                    session?.user?.email === ele.userId.email
                                                    &&
                                                    <div className='border rounded-full px-1 flex items-center gap-1'>
                                                        <button
                                                            className=' px-0.5 rounded-full hover:bg-blue-500 '
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                setUpdatingReply({
                                                                    mode: true,
                                                                    index: i,
                                                                    id: ele._id,
                                                                });

                                                                setReplyText(ele.reply);

                                                            }}
                                                        >
                                                            <BiPencil />
                                                        </button>

                                                        <button
                                                            className=' px-0.5 rounded-full hover:bg-red-500 '
                                                            onClick={(e) => { e.stopPropagation(); commentDeleteHandler(ele._id, i) }}
                                                        >
                                                            <AiTwotoneDelete />
                                                        </button>
                                                    </div>
                                                }



                                                <div
                                                    className='border rounded-full pr-2 flex items-center gap-1 hover:cursor-pointer'

                                                    onClick={() => { router.push(`/user/${ele?.userId?._id}`); }}
                                                >

                                                    <ImageReact className='w-7 rounded-full border' src={ele?.userId?.profilePic} />
                                                    <p className=' text-xs capitalize'>{ele?.userId?.username}</p>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>

                    }



                </div>

            </div>
        </>
    )

}


