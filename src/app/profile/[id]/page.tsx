
'use client'

import ImageReact from '@/app/components/ImageReact'
import MainLoader from '@/app/components/MainLoader'
// import HomeButton from '@/app/components/HomeButton'
import Navbar from '@/app/components/Navbar'
import SinglePostCard from '@/app/components/SinglePostCard'
import AnimatedTooltip from '@/app/components/ui/animated-tooltip'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { getUserData, updateUserData, useUserState } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
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

        if (!session?.user._id) return toast.error("You are looking logged out, please login.")

        if (!id) return toast.error("Refresh the page again please.")

        dispatch(updateUserData(
            {
                whatUpdate: 'addFriend',
                sender: session.user._id,
                reciver: id
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










