
'use client'

import ImageReact from '@/app/components/ImageReact'
import MainLoader from '@/app/components/MainLoader'
// import HomeButton from '@/app/components/HomeButton'
import Navbar from '@/app/components/Navbar'
import SinglePostCard from '@/app/components/SinglePostCard'
import AnimatedTooltip from '@/app/components/ui/animated-tooltip'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { AddMoreFeilsUserData, FriendsAllFriendData, getUserData, updateUserData, useUserState } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { RiUserAddLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'

const ProfilePageParams = ({ params }: any) => {

    const themeMode = useThemeData().mode

    const { data: session, status } = useSession()

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()

    const { userData, isLoading, errMsg } = useUserState()

    // console.log(status)


    useEffect(() => {

        if (status === "unauthenticated") {

            toast.error("You are unauthenticated person.")
            router.back()
        }

    }, [session])



    useEffect(() => {

        // console.log(params.id)

        if (params?.id && params?.id !== "undefined" && !userData._id) {

            // console.log(15455454)
            dispatch(getUserData(params.id))
        }


    }, [])




    return (
        <div
            className={` relative w-full min-h-screen flex flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"} `}
        >

            <Navbar />

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
            <div className=' my-5 border p-2 rounded flex flex-wrap justify-center items-center'>

                <ImageReact
                    className=" mr-4 w-40 border rounded-full mt-2"
                    src={userData.profilePic}
                    alt=""
                />

                <div className=' text-center'>
                    <p>Welcome</p>
                    <p className=' capitalize text-3xl font-semibold text-cyan-500'>{userData.username}</p>
                    <p className=' font-semibold'>{userData.email}</p>
                </div>

            </div>


            {/* {
                JSON.stringify(userData.sendRequest)
            }
            {
                JSON.stringify(userData.whoSeenProfile)
            } */}


            <ReciverRequestDiv />

            <SenderRequestDiv />


            <FriendsOfFriendsDiv
                searchedUser={userData}
                userData={userData}
            />



            {/* All post of user div */}
            <div
                className=" my-20 card_container relative sm:px-[8vh] mt-16 flex gap-10 gap-x-64 p-0.5 flex-wrap justify-center items-start "
            >

                {
                    userData.allPostOfUser.length > 0

                    &&

                    userData.allPostOfUser.map((ele) => {
                        return <SinglePostCard ele={ele} key={ele._id} />
                    })
                }


                {


                    (session?.user?.id && !isLoading && userData.allPostOfUser.length === 0)

                    &&

                    <div className=' text-center'>
                        <p className=' text-xl'>No Post found for You. 404</p>
                        <Link href={"/new-post"} className=' px-2 text-xs border rounded'>Write post</Link>
                    </div>
                }

            </div>

        </div>
    )
}

export default ProfilePageParams



function ReciverRequestDiv() {


    const { data: session, status } = useSession()

    const { userData } = useUserState()


    const dispatch = useDispatch<AppDispatch>()

    const router = useRouter()


    function acceptFriendRequest(id: string) {

        alert("okay")

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



    return (
        <div
            className=' w-[96%] sm:w-[65%] md:w-[50%]  px-1 py-2  rounded'
        >
            {

                (userData.reciveRequest && userData.reciveRequest.length > 0)

                &&

                <div className=' w-full'>

                    {
                        userData.reciveRequest.map((ele, i) => {
                            return (
                                <div
                                    key={ele._id}
                                    className={`w-full px-0.5 py-1 border-b flex justify-around items-center  ${i === 0 && "border-t"} `}
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

                                        className='border rounded px-2 text-green-500 font-semibold active:scale-75'

                                        onClick={() => acceptFriendRequest(ele._id)}
                                    >
                                        <span>Accept</span>
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



function SenderRequestDiv() {

    const { userData } = useUserState()

    const router = useRouter()

    return (

        <div
            className=' w-[96%] sm:w-[65%] md:w-[50%] px-1 py-2  rounded '
        >
            {

                (userData.sendRequest && userData.sendRequest.length > 0)

                &&

                <div>

                    {
                        userData.sendRequest.map((ele, i) => {
                            return (
                                <div
                                    key={ele._id}
                                    className={`w-full px-0.5 py-1 border-b flex justify-around items-center  ${i === 0 && "border-t"} `}
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

                                    <button>
                                        <span>cancel</span>
                                        <span>X</span>
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

                                <div className={`overflow-hidden mt-7 w-11/12 sm:w-3/4 md:w-1/2 px-1 border rounded flex flex-col justify-center items-center 
                            ${!seeFriends ? " border-0" : ` border`}  transition-all duration-500
                            `}
                                >
                                    {/* {JSON.stringify(friendsAllFriend)} */}

                                    <button
                                        className=' border px-3 rounded flex items-center gap-1 my-4 '
                                        onClick={() => { setSeeFriends(!seeFriends) }}

                                    >

                                        <span>See your Friends</span>

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



                                    <div
                                        className={` relative w-full flex flex-col  ${!seeFriends ? "h-0 py-0" : ` py-10`} transition-all duration-700 `}
                                    >

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


    const router = useRouter()

    const { data: session, status } = useSession()

    return (
        <div
            key={friend._id}
            className={`px-0.5 py-1 border-b flex items-center justify-between gap-1.5 ${i === 0 && "border-t"} `}
        >

            <div className=' flex gap-1 items-center flex-wrap'>


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

                <span className=' ml-7'>
                    {
                        friend.username
                    }
                </span>

            </div>

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
                    <span>

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



        </div>
    )
}


