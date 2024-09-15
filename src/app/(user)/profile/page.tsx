
'use client'

import ImageReact from '@/app/components/ImageReact'
import MainLoader from '@/app/components/MainLoader'
// import HomeButton from '@/app/components/HomeButton'
import SinglePostCard from '@/app/components/SinglePostCard'
import AnimatedTooltip from '@/app/components/ui/animated-tooltip'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { AddMoreFeilsUserData, FriendsAllFriendData, getProfileData, updateUserData, useUserState } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { PiSealCheckDuotone } from 'react-icons/pi'
import { RiUserAddLine } from 'react-icons/ri'
import { TbUserCancel } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
// import { IoIosCloudUpload } from "react-icons/io";
import { IoMdCloudUpload } from "react-icons/io";
import { uploadFileInCloudinary } from '@/lib/cloudinary';
import { MdOutlineZoomOutMap } from "react-icons/md";
import { setInnerHTMLOfModal, setOpenMoadl, useModalState } from '@/redux/slices/ModalSlice'
import useOpenModalWithHTML from '@/utils/OpenModalWithHtml'


const ProfilePageParams = () => {

    const themeMode = useThemeData().mode

    const { data: session, status } = useSession()

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()

    const { userData, isLoading, errMsg } = useUserState()

    // console.log(userData._id, session?.user._id)


    useEffect(() => {

        if (status === "unauthenticated") {

            toast.error("You are unauthenticated person.")
            router.push('/home')
        }

        if ((session?.user && session?.user._id) && (userData._id !== session?.user._id)) {
            dispatch(getProfileData(session?.user._id))
        }

    }, [session, status, userData])


    return (
        <div
            className={` relative w-full min-h-screen flex flex-col items-center overflow-hidden ${!themeMode ? " bg-black text-white " : " bg-white text-black"} `}
        >

            <MainLoader isLoading={isLoading} />

            {
                errMsg
                &&
                <p className=' my-5 border border-[#f92f60] rounded-lg px-4 py-2 text-xl'>
                    <span className=' mr-2 border border-[#f92f60] rounded-full size-4 p-0.5'>❌</span>
                    <span className=' border-b'>{errMsg}</span>
                </p>
            }


            {/* UserData div */}
            <div className=' my-5 border p-2 rounded flex flex-wrap justify-center items-center flex-col'>

                {/* User profile div here --------> */}

                <UserProfileImage />

                <div className=' text-center'>
                    <p>Welcome</p>
                    <p className=' capitalize text-3xl font-semibold text-cyan-500'>{userData.username}</p>
                    <p className=' font-semibold'>{userData.email}</p>
                </div>

            </div>


            <AllUploadedPicturesDiv />

            <ReciverRequestDiv />

            <SenderRequestDiv />


            {/* // // // TOPo :- These both props will neccessory, can we use global state directly ?? */}
            <FriendsOfFriendsDiv
                searchedUser={userData}
                userData={userData}
            />

            <AllPostByYou />


        </div>
    )
}

export default ProfilePageParams


function UserProfileImage() {

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()
    const { data: session } = useSession()
    // const router = useRouter()

    const { userData, isLoading, errMsg } = useUserState()
    const themeMode = useThemeData().mode

    const [imageFile, setImageFile] = useState<File>()

    const [postImageUrl, setPostImageUrl] = useState<string>('')

    const { open } = useModalState()

    // const [uploadedImg, setUplodedImg] = useState<string>('')


    function imgInputOnchangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        e.preventDefault();

        if (e.target.files) {

            const file = e?.target?.files[0]

            // // // Here now set file ---------->
            // File size should less then 2 mb. 
            if (file.size > 2097152) {
                return toast.error("File size should less then 2 mb")
            }

            setImageFile(file)
            // // // Show img direct by here --->
            setPostImageUrl(URL.createObjectURL(file))


        }
    }


    async function uploadImgaeAndUserDataHandler() {

        // // // If isLoading is pending then return the fn() call.
        if (isLoading) return;

        // // // After doing uplaod stuff here ------>
        let imageUrl = "";

        if (session?.user._id) {

            if (imageFile) {
                // // Now here we can uplaod file 2nd step ------>
                imageUrl = await uploadFileInCloudinary(imageFile)
                // console.log({ imageUrl })
            }

            dispatch(updateUserData({
                whatUpdate: "newProfilePic",
                sender: session.user._id,
                newProfilePic: imageUrl,
                reciver: ""
            }))
        }
        else {

            toast.error("Plese Login again.Or Refresh the page")
            router.push("/login")
        }


    }


    const seeFullSizeHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        dispatch(setOpenMoadl(!open))

        const innerHtml = <ImageReact
            src={postImageUrl}
            className=' rounded '
        />

        dispatch(setInnerHTMLOfModal(innerHtml))
    }


    useEffect(() => {

        (!postImageUrl || postImageUrl !== userData.profilePic) && setPostImageUrl(userData.profilePic)

    }, [userData])


    return (
        <>
            {
                userData._id
                &&

                <div
                    className='border p-0.5 w-40 h-40 rounded-full relative'
                    onClick={(e) => seeFullSizeHandler(e)}

                >

                    {
                        isLoading
                        &&
                        <MainLoader isLoading={isLoading} />
                    }

                    <button
                        className={`absolute top-0 -left-1  border rounded-full p-1 hover:scale-90 hover:cursor-pointer transition-all ${!themeMode ? "bg-black" : "bg-white"} active:scale-75 active:opacity-75 transition-all`}
                    >
                        <MdOutlineZoomOutMap
                            className=' text-3xl'
                        />
                    </button>


                    <ImageReact
                        className=" w-full h-full rounded-full object-cover"
                        src={postImageUrl}
                        alt=""
                    />

                    <input
                        className={` hidden`}
                        type="file"
                        name=""
                        accept="image/png, image/png, image/jpeg"
                        id="profile_img"
                        onChange={(e) => { imgInputOnchangeHandler(e) }}
                    />

                    <label
                        htmlFor='profile_img'
                        className={`absolute bottom-2 right-2  border rounded-full p-0.5 hover:scale-90 hover:cursor-pointer transition-all ${!themeMode ? "bg-black" : "bg-white"} active:scale-75 active:opacity-75 transition-all`}
                    >
                        <IoMdCloudUpload
                            className=' text-4xl'
                        />
                    </label>

                </div>
            }


            {
                // userData.profilePic !== postImageUrl
                // &&

                <div className='w-40 flex gap-2 justify-center my-2 px-2'>
                    <button
                        className={`px-1  border rounded-full bg-green-500 font-bold text-xs  ${userData.profilePic !== postImageUrl ? " scale-100" : "scale-0"} transition-all duration-700 `}
                        onClick={() => { uploadImgaeAndUserDataHandler() }}
                    >Upload</button>
                    <button
                        className={`px-1  border rounded-full bg-rose-500 font-bold text-xs  ${userData.profilePic !== postImageUrl ? " scale-100" : "scale-0"} transition-all duration-700  `}
                        onClick={() => { setPostImageUrl(userData.profilePic) }}
                    >X</button>
                </div>

            }

        </>
    )
}

function AllUploadedPicturesDiv() {


    const { userData, isLoading, errMsg } = useUserState()

    const dispatch = useDispatch<AppDispatch>()

    const { data: session } = useSession()

    const [clickedPicIndex, setClickedPicIndex] = useState<number | null>(null)

    const open = useModalState().open

    function makeDpThisImage(image: string) {

        if (!image) return toast.error("Image not getting, please refresh the page.")

        if (image === userData.profilePic) return toast.error("This image is already your profile pic.")

        if (session?.user._id) {


            dispatch(updateUserData({
                whatUpdate: "makeProfilePic",
                sender: session.user._id,
                newProfilePic: image,
                reciver: ""
            }))
        }

    }


    // // // This fn() is very imp. when swap next and previous. Don't remove this line.
    function preventSwitchingInTabs(e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation()
    }



    const callModalFn = useOpenModalWithHTML()

    const seeFullSizeHandler = (e: any, i: number, ele: string) => {
        e?.stopPropagation();
        
        const innerHtml = <div className=' flex flex-col items-center justify-center '>
            <ImageReact
                src={ele}
                className=' rounded '
            />
            <button
                className=' px-4 py-2 rounded-md bg-green-500 my-2'
                onClick={() => {
                    setClickedPicIndex(i);
                    makeDpThisImage(ele);
                }}
            >Make Profile Pic</button>
        </div>

        callModalFn({ innerHtml })
    }


    return (
        <div className=' flex flex-col items-center '>
            {
                userData.allProfilePic
                    &&
                    userData.allProfilePic.length > 0

                    ?
                    <div className=' lg:w-[70%] my-10 rounded-md shadow-xl shadow-cyan-950 '>
                        <p className=' text-center underline font-semibold my-2'>All {userData?.allProfilePic?.length} uploaded picture by you.</p>
                        <p className=' text-center text-xs'>Click on image to make profile pic.</p>

                        <div
                            className=' scrooller_bar_hidden px-5 py-4 relative w-[98vw] lg:w-full flex lg:flex-wrap gap-1 lg:gap-3 items-center justify-start overflow-x-scroll z-[5] lg:max-h-[45vh]'

                            onTouchStart={preventSwitchingInTabs}
                            onTouchMove={preventSwitchingInTabs}
                            onTouchEnd={preventSwitchingInTabs}
                            onMouseDown={preventSwitchingInTabs}
                            onMouseMove={preventSwitchingInTabs}
                            onMouseUp={preventSwitchingInTabs}
                        >


                            {
                                userData.allProfilePic.map((ele, i) => {
                                    return (

                                        <span
                                            key={i}
                                            className='aspect-square h-[20vh] relative '
                                        >
                                            {
                                                clickedPicIndex === i
                                                &&
                                                <MainLoader isLoading={isLoading} />
                                            }

                                            <ImageReact
                                                key={i}
                                                className={` aspect-square p-1 w-[20vh] h-[20vh] border rounded-full object-cover active:scale-75 active:opacity-75 hover:cursor-pointer hover:scale-90 transition-all
                                                
                                                ${userData.profilePic === ele && " border-2 border-green-500 blur-sm"} 
                                            `}
                                                src={ele}
                                                alt=""
                                                onClick={(e: any) => {

                                                    seeFullSizeHandler(e, i, ele);

                                                }}
                                            />
                                        </span>

                                    )
                                })
                            }
                        </div>

                    </div>
                    : <></>
            }
        </div>
    )

}

function ReciverRequestDiv() {


    const { data: session, status } = useSession()

    const { userData } = useUserState()


    const dispatch = useDispatch<AppDispatch>()

    const router = useRouter()


    function acceptFriendRequest(id: string) {

        // alert("okay")

        if (!session?.user._id) return toast.error("You are looking logged out, please login.")

        if (!id) return toast.error("Refresh the page again please.")

        dispatch(updateUserData(
            {
                whatUpdate: 'addFriend',
                // sender: session.user._id,
                // reciver: id
                sender: id,
                reciver: session.user._id
            }
        ))

    }

    function cancelRequest(id: string, name: string) {


        let ask = confirm(`Do you want Cancel this request.`)

        if (!ask) return

        if (session?.user._id) {
            dispatch(updateUserData({
                whatUpdate: "cancelFrndRequest",
                sender: session?.user._id,
                reciver: id
            }))
        }

    }


    return (
        <div
            className=' w-[96%] sm:w-[65%] md:w-[50%]  px-1 py-2  rounded'
        >
            {

                (userData.reciveRequest && userData.reciveRequest.length > 0)

                &&

                <div className=' w-full flex flex-col items-center'>

                    <p className=' text-center mb-3 px-2 border-b rounded'>All friend request recived.</p>

                    {
                        userData.reciveRequest.map((ele, i) => {
                            return (
                                <div
                                    key={ele._id}
                                    className={`w-full py-1 border-b flex justify-between px-2 items-center  ${i === 0 && "border-t"} `}
                                >

                                    <div className=' flex gap-2 items-center '>

                                        <div className=' relative flex'>
                                            <AnimatedTooltip
                                                items={
                                                    [
                                                        {
                                                            id: 1,
                                                            name: ele.username,
                                                            designation: ele.email,
                                                            image: ele.profilePic,
                                                            onClickFunction: (() => { router.push(`/user/${ele._id}`) })
                                                        }

                                                    ]
                                                }
                                            />
                                        </div>

                                        <span className=' ml-7'>
                                            {
                                                ele.username
                                            }
                                        </span>

                                    </div>


                                    {/* yaha pr cancle request ki btn honi chahiye  */}

                                    <div className=' flex gap-2 items-center justify-center flex-wrap'>

                                        <button

                                            className='border rounded px-2 text-green-500 font-semibold active:scale-75'

                                            onClick={() => acceptFriendRequest(ele._id)}
                                        >
                                            <span>Accept</span>
                                        </button>

                                        <button

                                            className='border rounded px-2 text-red-500 font-semibold active:scale-75'

                                            onClick={() => cancelRequest(ele._id, ele.username)}
                                        >
                                            <span>Cancel</span>
                                        </button>

                                    </div>

                                </div>
                            )
                        })
                    }

                </div>

                // JSON.stringify(userData.reciveRequest)
            }


        </div>


    )

}


function SenderRequestDiv() {

    const { userData } = useUserState()

    const dispatch = useDispatch<AppDispatch>()

    const router = useRouter()

    const { data: session, status } = useSession()


    function cancelRequest(id: string, name: string) {


        let ask = confirm(`Do you want Cancel this request.`)

        if (!ask) return

        if (session?.user._id) {
            dispatch(updateUserData({
                whatUpdate: "cancelFrndRequest",
                sender: session?.user._id,
                reciver: id
            }))
        }

    }


    return (

        <div
            className=' w-[96%] sm:w-[65%] md:w-[50%] px-1 py-2  rounded '
        >
            {

                (userData.sendRequest && userData.sendRequest.length > 0)

                &&

                <div className=' w-full flex flex-col items-center'>

                    <p className=' text-center mb-3 px-2 border-b rounded'>All friend request to user sended by you.</p>

                    {
                        userData.sendRequest.map((ele, i) => {
                            return (
                                <div
                                    key={ele._id}
                                    className={`w-full py-1 border-b flex  justify-between px-2  items-center  ${i === 0 && "border-t"} `}
                                >

                                    <div className=' flex gap-2 items-center flex-wrap '>

                                        <div className=' relative flex'>
                                            <AnimatedTooltip
                                                items={
                                                    [
                                                        {
                                                            id: 1,
                                                            name: ele.username,
                                                            designation: ele.email,
                                                            image: ele.profilePic,
                                                            onClickFunction: (() => { router.push(`/user/${ele._id}`) })
                                                        }

                                                    ]
                                                }
                                            />
                                        </div>

                                        <span className=' ml-7'>
                                            {
                                                ele.username
                                            }
                                        </span>

                                    </div>



                                    {/* yaha pr cancle request ki btn honi chahiye  */}

                                    <button
                                        className=' text-xm border rounded-md px-2'

                                        onClick={() => { cancelRequest(ele._id, ele.username) }}
                                    >
                                        <span>Cancel</span>
                                        <span>❌</span>
                                    </button>


                                </div>
                            )
                        })
                    }

                </div>

                // JSON.stringify(userData.reciveRequest)
            }


        </div>


    )

}


function FriendsOfFriendsDiv(

    {
        searchedUser,
        userData
    }: {
        searchedUser: AddMoreFeilsUserData,
        userData: AddMoreFeilsUserData
    }

) {

    const router = useRouter()

    const { data: session } = useSession()

    const dispatch = useDispatch<AppDispatch>()

    const [seeFriends, setSeeFriends] = useState(false)


    function addFrined() {

        if (!session?.user._id) return toast.error("You are looking logged out, please login.")

        if (!searchedUser?._id) return toast.error("Refresh the page again please.")

        dispatch(updateUserData(
            {
                whatUpdate: 'sendFriendRequest',
                sender: session.user._id,
                reciver: searchedUser?._id
            }
        ))

    }


    return (

        <>
            {


                (searchedUser.friendsAllFriend && searchedUser.friendsAllFriend.length > 0)
                    ?

                    <Fragment>

                        {

                            (searchedUser.friendsAllFriend?.map(ele => ele._id).includes(session?.user._id || '') || searchedUser.email === session?.user.email)
                                ?
                                // // // if you are a friend of user

                                <div className={`mt-7 w-11/12 sm:w-3/4 md:w-1/2 px-1 border rounded flex flex-col justify-center items-center 
                                     ${!seeFriends ? " border-0 overflow-hidden" : ` border`}  transition-all duration-500
                                    `}
                                >
                                    {/* {JSON.stringify(friendsAllFriend)} */}

                                    <button
                                        className=' border px-3 rounded flex items-center gap-1 my-4 '
                                        onClick={() => { setSeeFriends(!seeFriends) }}

                                    >

                                        <span className=' font-bold'>Your Friends</span>

                                        <span>
                                            {
                                                !seeFriends
                                                    ?
                                                    <span><IoIosArrowDown /></span>

                                                    :
                                                    <span><IoIosArrowUp /></span>
                                            }
                                        </span>


                                    </button>


                                    {/* Actual friends will shown here ---------> */}
                                    <div
                                        className={` relative w-full flex flex-col  ${!seeFriends ? "h-0 py-0" : ` py-10`} transition-all duration-700 `}
                                    >

                                        <div
                                            className={`px-0.5 `}
                                        >
                                            <p className=' text-end'>You have <span>{userData.friendsAllFriend?.length} friend<span>{userData.friendsAllFriend && userData.friendsAllFriend?.length > 1 && "s"}</span>.</span></p>
                                        </div>

                                        {
                                            searchedUser.friendsAllFriend.map((friend, i) => <SingleUserDiv
                                                key={friend._id}
                                                i={i}
                                                friend={friend}
                                                userData={userData}
                                            />)
                                        }


                                        {
                                            seeFriends
                                            &&
                                            <button
                                                onClick={() => { setSeeFriends(false) }}
                                                className='px-2 absolute right-2 bottom-2 border rounded-md text-sm hover:scale-90 transition-all '
                                            >Close</button>
                                        }



                                    </div>


                                </div>
                                :

                                // // // if you are not a friend of user
                                <div>


                                    <button
                                        className=' text-2xl px-3 py-1 bg-green-600 text-white rounded-md flex gap-1 items-center hover:scale-110 active:scale-90 transition-all'

                                        onClick={() => {
                                            addFrined()
                                        }}

                                    >
                                        <span>Add Friend</span>
                                        <span>
                                            <RiUserAddLine />
                                        </span>
                                    </button>

                                </div>
                        }



                    </Fragment>
                    :

                    // // // yaha pr 2 case banega
                    // // 1. agr user ke request me tumhari id hai to 
                    // // else

                    <>
                        {

                            (searchedUser.reciveRequest && searchedUser.reciveRequest.map(ele => ele._id).includes(userData._id))

                                ?
                                <div>

                                    <p className=' flex gap-1.5 flex-wrap items-center'>
                                        <span>Friend request sended</span>
                                        <IoCheckmarkDoneOutline />
                                    </p>

                                </div>

                                :

                                <div>

                                    {
                                        searchedUser?._id
                                        &&
                                        searchedUser.email !== userData.email
                                        &&

                                        <button
                                            className=' text-2xl px-3 py-1 bg-green-600 text-white rounded-md flex gap-1 items-center hover:scale-110 active:scale-90 transition-all'

                                            onClick={() => {
                                                addFrined()
                                            }}

                                        >
                                            <span>Add Friend</span>
                                            <span>
                                                <RiUserAddLine />
                                            </span>
                                        </button>

                                    }

                                </div>
                        }

                    </>




            }
        </>

    )

}


function SingleUserDiv(
    {
        friend,
        i,
        userData
    }: {
        friend: FriendsAllFriendData,
        i: number,
        userData: AddMoreFeilsUserData
    }

) {

    const dispatch = useDispatch<AppDispatch>()

    const router = useRouter()

    const { data: session, status } = useSession()


    function removeFriend(id: string, name: string) {


        let ask = confirm(`Do you really want to remove friendshipe with ${name}?`)

        if (!ask) return

        if (session?.user._id) {
            dispatch(updateUserData({
                whatUpdate: "removeFriend",
                sender: session?.user._id,
                reciver: id
            }))
        }



    }


    return (
        <div
            key={friend._id}
            className={`px-0.5 py-1 border-b flex items-center justify-between flex-wrap gap-1.5 ${i === 0 && "border-t"} `}
        >

            <div
                className=' flex gap-1 items-center flex-wrap hover:cursor-pointer'
                onClick={() => { router.push(`/user/${friend._id}`) }}

            >


                <div className=' relative flex'>
                    <AnimatedTooltip
                        items={
                            [
                                {
                                    id: 1,
                                    name: friend.username,
                                    designation: friend.email,
                                    image: friend.profilePic,
                                    onClickFunction: (() => { router.push(`/user/${friend._id}`) })
                                }

                            ]
                        }
                    />
                </div>

                <div className='ml-5 flex flex-col leading-5'>
                    <p className='  font-semibold capitalize flex gap-1 items-end'>
                        {
                            friend.username
                        }

                        {
                            friend.isVerified
                            &&
                            <span className="mr-2 mt-2.5 text-green-500 ">
                                <PiSealCheckDuotone />
                            </span>
                        }

                    </p>

                    <p className='  text-sm font-extralight'>
                        {
                            friend.email
                        }
                    </p>
                </div>

            </div>




            <div
                className=' flex gap-2 items-end flex-wrap'
            >



                {

                    (session && !friend.friends.includes(session?.user?._id))
                        ?
                        <span
                            className=' ml-auto mr-2'
                        >
                            {
                                friend._id === session?.user._id
                                    ?
                                    <span className=' text-xs text-violet-500 font-semibold'>You</span>
                                    :
                                    <span>
                                        <RiUserAddLine />
                                    </span>
                            }
                        </span>


                        :
                        // // // //  Agr ab main user is searching user ka dost nhi hai to main user ke send request me chcek kro kya user waha exist krta hai ??
                        // // 1. request sended
                        // // 2. you
                        // // 3. Already frined
                        <span className=' ml-auto'>

                            {

                                (
                                    userData.sendRequest
                                    &&
                                    (userData.sendRequest.length > 0)
                                    &&
                                    userData.sendRequest.map(ele => ele._id).includes(friend._id)
                                )
                                    ?
                                    <span className=' text-green-500 '>
                                        <IoCheckmarkDoneOutline />
                                    </span>

                                    :
                                    <span>
                                        {
                                            friend._id === session?.user._id
                                                ?
                                                <span className=' text-xs text-violet-500 font-semibold'>You</span>
                                                :
                                                <span className=' text-xs text-green-500'>Friend</span>
                                        }
                                    </span>

                            }
                        </span>

                }



                <button
                    className=' border border-red-500 text-red-500  rounded-md p-0.5 text-xs'
                    onClick={() => { removeFriend(friend._id, friend.username) }}
                >
                    <TbUserCancel />
                </button>


            </div>


        </div>
    )
}


function AllPostByYou() {

    const { data: session, status } = useSession()

    const { userData, isLoading, errMsg } = useUserState()


    return (


        <div
            className=" my-20 card_container relative sm:px-[8vh] mt-16 flex gap-10 gap-x-64 p-0.5 flex-wrap justify-center items-start "
        >

            {
                userData.allPostOfUser.length > 0
                &&
                <div>
                    <p className=' text-center text-2xl '>All post by you 👇</p>

                    <div
                        className=" my-10 card_container relative sm:px-[8vh] mt-16 flex gap-10 gap-x-64 p-0.5 flex-wrap justify-center items-start "
                    >

                        {
                            userData.allPostOfUser.map((ele) => {
                                return <SinglePostCard ele={ele} key={ele._id} />
                            })

                        }
                    </div>
                </div>
            }


            {

                (session?.user?.id && !isLoading && userData.allPostOfUser.length === 0)
                &&
                <div className=' text-center'>
                    <p className=' text-xl'>No Post found for You. 404</p>
                    <Link href={"/create"} className=' px-2 text-xs border rounded'>Write post</Link>
                </div>
            }

        </div>

    )

}

