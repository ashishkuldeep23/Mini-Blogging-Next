
'use client'

import ImageReact from '@/app/components/ImageReact'
import MainLoader from '@/app/components/MainLoader'
import Navbar from '@/app/components/Navbar'
// import SinglePostCard from '@/app/components/SinglePostCard'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { getUserData, updateUserData, useUserState } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { RiUserAddLine } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";
import AnimatedTooltip from '@/app/components/ui/animated-tooltip'
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { PiSealCheckDuotone } from 'react-icons/pi'
import { TbUserCancel } from "react-icons/tb";
import SingleUserDiv from '@/app/components/SingleUserDiv'
import { AddMoreFeilsUserData } from '@/Types'
import SinglePostCardNew from '@/app/components/SinglePostCardNew'


const UserPageParams = ({ params }: any) => {

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const themeMode = useThemeData().mode
    const { data: session, status } = useSession()

    const { searchedUser, isLoading, errMsg, userData } = useUserState()


    useEffect(() => {

        // console.log(params.id)

        if (params?.id && params?.id !== "undefined") {

            if (searchedUser?._id !== params?.id) {
                dispatch(getUserData(params.id))
            }
        }

    }, [])



    useEffect(() => {

        if (userData._id && searchedUser._id) {
            if (userData?._id === searchedUser?._id) router.push(`/profile`)
        }

    }, [userData, searchedUser])



    useEffect(() => {

        if (status === 'unauthenticated') {
            toast.error("LogIn Please. You are unauthenticated for this page | 401")
            router.push("/login")
        }
    }, [status])


    // set All frineds ids.

    return (
        <div
            className={` relative w-full min-h-screen flex flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"} `}
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


            {
                searchedUser?.username
                &&

                <div className=' my-5 border p-2 rounded flex flex-wrap justify-center items-center relative'>

                    {
                        isLoading
                        &&
                        <MainLoader isLoading={isLoading} />
                    }

                    {
                        searchedUser?.profilePic
                        &&
                        <ImageReact
                            className=" mr-4 w-40 border rounded-full mt-2"
                            src={searchedUser?.profilePic}
                            alt=""
                        />
                    }


                    <div className=' text-center'>
                        {/* <p>User</p> */}
                        <p className=' capitalize text-3xl font-semibold text-cyan-500'>{searchedUser?.username}</p>
                        <p className=' font-semibold'>{searchedUser?.email}</p>
                    </div>

                </div>

            }


            <FriendsOfFriendsDiv
                searchedUser={searchedUser}
                userData={userData}
            />

            <div
                className=" my-20 card_container relative sm:px-[8vh] mt-16 flex gap-10 gap-x-64 p-0.5 flex-wrap justify-center items-start "
            >

                {
                    searchedUser.allPostOfUser.length > 0
                    &&
                    searchedUser.allPostOfUser.map((ele) => {
                        return <SinglePostCardNew ele={ele} key={ele._id} />
                    })
                }


                {

                    (
                        session?.user?.id
                        && !isLoading
                        // && searchedUser.allPostOfUser.length === 0
                    )

                    &&
                    <div className=' text-center'>
                        <p className=' text-red-600 font-semibold'>Fail to laod user data.❌</p>
                        <Link href={"/"} className=' px-2 text-xs border rounded'>Goto Home</Link>
                    </div>
                }

            </div>

        </div >
    )
}

export default UserPageParams

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


    function addFriend(id: string) {

        if (!session?.user._id) return toast.error("You are looking logged out, please login.")

        if (!searchedUser?._id) return toast.error("Refresh the page again please.")

        dispatch(updateUserData(
            {
                whatUpdate: 'sendFriendRequest',
                sender: session.user._id,
                reciver: id
            }
        ))

    }


    function removeFriend(id: string, name: string) {


        let ask = confirm(`Do you really want to remove friendshipe with ${name}?`)

        if (!ask) return



        if (session?.user?._id) {
            dispatch(updateUserData({
                whatUpdate: "removeFriend",
                sender: session?.user._id,
                reciver: id
            }))
        }



    }


    return (

        <>
            {


                (searchedUser.friendsAllFriend)
                    &&

                    searchedUser.friendsAllFriend.length > 0
                    ?

                    <Fragment>

                        {

                            searchedUser.friendsAllFriend?.map(ele => ele._id).includes(session?.user._id || '')
                                ?
                                // // // if you are a friend of user

                                <div className={` mt-7 w-11/12 sm:w-3/4 md:w-1/2 px-1 border rounded flex flex-col justify-center items-center 
                                        ${!seeFriends ? " border-0 overflow-hidden" : ` border`}  transition-all duration-500
                                `}
                                >

                                    <button
                                        className=' border border-red-500 text-red-500 font-semibold px-3 rounded flex items-center gap-1 my-2 '
                                        onClick={() => { removeFriend(searchedUser._id, searchedUser.username) }}
                                    >

                                        <span >Unfriend</span>
                                        <span>
                                            <TbUserCancel />
                                        </span>


                                    </button>


                                    {/* {JSON.stringify(friendsAllFriend)} */}

                                    <button
                                        className=' border px-3 rounded flex items-center gap-1 my-2 '
                                        onClick={() => { setSeeFriends(!seeFriends) }}
                                    >

                                        <span>See Friends</span>
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


                                    {/* This is the main ui to show all friends ----------> */}
                                    <div
                                        className={` relative w-full flex flex-col  ${!seeFriends ? "h-0 py-0" : ` py-10`} transition-all duration-700 `}
                                    >

                                        <div
                                            className={`px-0.5 `}
                                        >
                                            <p className=' text-end'>
                                                {searchedUser.username} have <span>{searchedUser.friendsAllFriend && searchedUser.friendsAllFriend?.length} friend<span>{searchedUser.friendsAllFriend && searchedUser.friendsAllFriend?.length > 1 && "s"}</span>.</span>
                                            </p>
                                        </div>

                                        {
                                            searchedUser.friendsAllFriend.map((friend, i) => <SingleUserDiv
                                                key={friend._id}
                                                i={i}
                                                friend={friend}
                                                userData={userData}
                                                addFriend={addFriend}
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

                                // // // if you are not a friend of this user
                                // // here we got 2 conditions -------->
                                // // 1. if you sended the friend request to user (You need to search id in your sendRequest field)
                                // // 2. else part 

                                <div>

                                    {
                                        userData.sendRequest && userData?.sendRequest.map(ele => ele._id).includes(searchedUser._id)
                                            ?
                                            <p className=' flex gap-1.5 flex-wrap items-center border-b px-2'>
                                                <span>Friend request sended</span>
                                                <IoCheckmarkDoneOutline />
                                            </p>



                                            :
                                            <button
                                                className=' text-2xl px-3 py-1 bg-green-600 text-white rounded-md flex gap-1 items-center hover:scale-110 active:scale-90 transition-all'
                                                onClick={() => {
                                                    addFriend(searchedUser._id)
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






                    </Fragment>

                    :

                    <Fragment>
                        {
                            searchedUser._id
                            &&

                            <Fragment>

                                {
                                    userData.sendRequest && userData?.sendRequest.map(ele => ele._id).includes(searchedUser._id)
                                        ?
                                        <p className=' flex gap-1.5 flex-wrap items-center border-b px-2'>
                                            <span>Friend request sended</span>
                                            <IoCheckmarkDoneOutline />
                                        </p>

                                        :

                                        <div className=' flex flex-col items-center'>

                                            <button
                                                className=' text-2xl px-3 py-1 bg-green-600 text-white rounded-md flex gap-1 items-center hover:scale-110 active:scale-90 transition-all'
                                                onClick={() => addFriend(searchedUser._id)}

                                            >
                                                <span>Add Friend</span>
                                                <span>
                                                    <RiUserAddLine />
                                                </span>
                                            </button>
                                        </div>
                                }

                            </Fragment>
                        }
                    </Fragment>



                // // Ignore now ------->
                // // // yaha pr 2 case banega
                // // 1. agr user ke request me tumhari id hai to 
                // // else

            }
        </>

    )

}
