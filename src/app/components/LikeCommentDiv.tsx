'Use client'

import { Comment, PostInterFace, ReplyInterFace, setSinglePostdata, setUpdateComment } from '@/redux/slices/PostSlice';
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
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




interface UpdatingComment {
    mode: boolean,
    value: string,
    commentId: string
}


const LikeCommentDiv = ({ post }: { post: PostInterFace }) => {

    const { data: session, status } = useSession()

    const textAreaInputRef = useRef<HTMLTextAreaElement>(null)

    const params = usePathname()

    const [showComment, setShowComment] = useState(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [userID, setUserID] = useState<string>("")


    const [updatingComment, setUpdatingComment] = useState<UpdatingComment>({
        mode: false,
        value: "",
        commentId: ""
    })


    const [commentIds, setCommentIds] = useState<string[]>([])


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

        setShowComment(true)

        // console.log(textDivRef)
    }


    const reWriteHandler = () => {

        if (!checkUserStatus("Plese login to rewrite post.")) return

        setIsLoading(true)

        setIsLoading(false)
    }


    const updatePostHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()

        toast.success("Update post")

    }

    const deletePostHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        toast.success("Delete post")

    }



    useEffect(() => {

        if (post.comments.length > 0) {

            let idsOfComments = post.comments.map((ele) => ele?.userId?._id)

            // console.log(idsOfComments)

            setCommentIds(idsOfComments)

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

        if (params !== "/") {
            setShowComment(true)
        }


    }, [])

    return (
        <div className=' relative'>

            <MainLoader isLoading={isLoading} />


            <div className=" relative  mt-2">


                {/* Like comments buttons -----> */}
                <div className='flex gap-5'>

                    {/* Like btn */}
                    <button
                        className={`  border px-1 rounded-lg flex items-center gap-1 ${post?.likesId?.includes(userID.toString()) && "text-rose-500 border-rose-500 shadow-md shadow-rose-500"} `}
                        onClick={(e) => { likeClickHandler(e) }}
                    >
                        <span>{post.likes}</span>
                        <span > <SlLike /> </span>
                    </button>


                    {/* comment btn */}
                    <button
                        className={`border px-1 rounded-lg flex items-center gap-1
                            ${commentIds.includes(userID.toString()) && "text-yellow-500 border-yellow-500 shadow-md shadow-yellow-500"}
                        `}
                        onClick={(e) => { commentBtnClicked(e) }}
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



                    {

                        post?.author?.email === session?.user?.email
                        &&

                        <div className=' ml-auto mr-1 flex gap-0'>
                            <button
                                className=" border px-2 rounded-lg mx-0.5 hover:bg-blue-500"
                                onClick={updatePostHandler}
                            >
                                <BiPencil />
                            </button>

                            <button
                                className=" border px-2 rounded-lg  mx-0.5 hover:bg-red-500"
                                onClick={deletePostHandler}
                            >
                                <AiTwotoneDelete />
                            </button>
                        </div>

                    }



                </div>

                {
                    showComment
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
                    post.comments.length > 0
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
        post: PostInterFace,
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
            <div className='ml-auto sm:w-[90%] mt-3 flex flex-col relative p-0.5 border border-green-300 my-0.5 px-1 rounded-lg '>

                <MainLoader isLoading={isLoading} />

                <p className=" ml-1 ">
                    Give your <span className=" underline">comment</span> here 👇
                </p>


                <div className=" flex flex-wrap items-center">
                    {
                        ["👍", "😍", "😀", "👌", "👎", "Good", 'Nice', "OSM", "Informative", "Bad!", ",", ".", "X"].map((ele, i) => {
                            return (
                                <button
                                    key={i}
                                    className={`border border-l-2 border-b-2 p-0.5 m-0.5 rounded text-xs ${ele === "X" && "ml-2 border-red-500"} `}

                                    onClick={() => {
                                        if (commentValue.value) {

                                            if (ele === "," || ele === ".") {
                                                setCommentValue({ value: `${commentValue.value}${ele}` })
                                            } 

                                            else if(ele === "X"){
                                                setCommentValue({ value: `` })
                                            }
                                            else {
                                                setCommentValue({ value: `${commentValue.value} ${ele}` })
                                            }

                                        } else {
                                            setCommentValue({ value: `${commentValue.value}${ele}` })
                                        }


                                        if (textAreaInputRef?.current) {
                                            textAreaInputRef.current.scrollTop = textAreaInputRef.current?.scrollHeight
                                        }
                                        // &&

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

                <div className="flex">
                    <textarea
                        ref={textAreaInputRef}
                        style={{ resize: "none" }}
                        placeholder="Give your comment here."
                        className={`w-full h-full border rounded px-2 mx-0.5 ${!themeMode ? "bg-black text-white" : "bg-white text-black"} `}
                        value={commentValue.value}
                        onChange={(e) => { setCommentValue({ value: e.target.value }) }}
                    ></textarea>

                    <button
                        className={`font-bold border rounded px-2 mx-0.5 ${!themeMode ? "bg-green-700 " : "bg-green-300 "} `}
                        onClick={(e) => {
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
    post: PostInterFace,
    updatingComment: UpdatingComment,
    setUpdatingComment: Function,
}) {


    const params = usePathname()


    if (params === "/") {
        return <></>
    }


    return (
        <div
            className=" my-5 mx-0.5 border border-rose-400 rounded-md"
        >
            {
                post.comments.map((comment, i) => <SingleCommentUI
                    post={post}
                    key={i}
                    i={i}
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
    updatingComment,
    setUpdatingComment,
}: {
    post: PostInterFace,
    comment: Comment,
    i: number,
    updatingComment: UpdatingComment,
    setUpdatingComment: Function,
}) => {

    const dispatch = useDispatch()

    const { data: session, status } = useSession()

    const [isLoading, setIsLoading] = useState(false)

    const [commentClicked, setCommentClicked] = useState(false)

    // console.log(session?.user.email)


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
                className={` ${i % 2 !== 0 && "sm:ml-auto"} border rounded m-1 p-0.5 sm:w-[80%] relative`}
            >


                <MainLoader isLoading={isLoading} />


                <div className='flex gap-1 items-end justify-between'>


                    <div className="w-[90%] flex flex-col gap-1 ">

                        <div className=" flex gap-1">


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
                                    onClick={() => {
                                        updateSingleComment()
                                    }}
                                >
                                    <BiPencil />

                                </button>

                                <button
                                    onClick={deleteSingleComment}
                                    className=" border rounded p-1 mx-1 hover:bg-red-500"
                                >
                                    <AiTwotoneDelete />

                                </button>

                            </div>

                        }





                    </div>

                    <div className=" p-0.5 py-1 flex flex-col">

                        <button
                            className={`flex gap-0.5 items-center justify-center mb-1.5 border p-1 rounded text-xs
                                     ${comment?.likesId?.includes(session?.user?.id || "") && "text-rose-500 border-rose-500 shadow-md shadow-rose-500"}
                            `}
                            onClick={() => { likeComment() }}
                        >

                            {/* <span
                        className=" absolute font-semibold text-xs -top-[35%] -right-[15%] "
                    >{comment?.likesId?.length}</span> */}

                            <span>{comment.likes}</span>

                            <SlLike />
                        </button>

                        <button
                            className=" flex gap-0.5 items-center justify-center border p-1 rounded text-xs"
                            onClick={() => { setCommentClicked((last) => !last) }}
                        >
                            <span>{comment.replies.length}</span>

                            <FaRegCommentDots />
                        </button>

                    </div>


                </div>

                {

                    (comment.likes > 0 || comment.replies.length > 0 || commentClicked)
                    &&
                    <SeeMoreOfComment commentClicked={commentClicked} comment={comment} />
                }


            </div>


        </>

    )
}

function SeeMoreOfComment({ commentClicked, comment }: { commentClicked: boolean, comment: Comment, }) {

    const themeMode = useThemeData().mode

    const { data: session, status } = useSession()

    const dispatch = useDispatch<AppDispatch>()

    const [seeMoreBtn, setSeeMoreBtn] = useState(false)

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

                        onClick={() => { setSeeMoreBtn((last) => !last); getCommentData() }}

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
                    className={`overflow-hidden relative rounded px-1 py-0.5  flex flex-col ${!seeMoreBtn ? " h-1 border-0 opacity-100 " : " h-auto border opacity-100"}  transition-all `}
                >

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

                        />
                        <button
                            className={`font-semibold  ml-auto md:ml-1 border py-0 text-sm rounded px-1 ${themeMode ? "bg-green-400" : "bg-green-600"}`}
                            onClick={() => {
                                if (!updatingReply.mode) {
                                    submitReplyHandler()
                                } else {
                                    commentEditHandler(updatingReply.id, updatingReply.index)
                                }
                            }}
                        >{

                                !updatingReply.mode ? "Reply" : "Update"

                            }</button>
                    </div>

                    <p
                        className=' text-xs text-end'
                    >
                        {comment.likes} likes and {comment.replies.length} replies.
                    </p>




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
                        <div className='border rounded my-1 p-0.5'>

                            <p>Likes 👇</p>


                            <div
                                className=' flex gap-1 flex-wrap'
                            >

                                {
                                    likedBy.map((ele, i) => {
                                        return (
                                            <Fragment key={i}>

                                                <div className='border rounded-full pr-2 flex items-center gap-1 w-fit'>

                                                    <ImageReact className='w-7 rounded-full border' src={ele?.profilePic} />
                                                    <p className='text-xs capitalize'>{ele.username}</p>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>


                        </div>

                    }



                    {
                        replies.length > 0
                        &&

                        <div className=' border rounded my-1 p-0.5'>


                            <p>Replies 👇</p>

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
                                                            onClick={() => {

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
                                                            onClick={() => { commentDeleteHandler(ele._id, i) }}
                                                        >
                                                            <AiTwotoneDelete />
                                                        </button>
                                                    </div>
                                                }



                                                <div className='border rounded-full pr-2 flex items-center gap-1'>

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


