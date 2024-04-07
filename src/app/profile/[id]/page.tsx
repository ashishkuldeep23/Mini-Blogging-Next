
'use client'

import ImageReact from '@/app/components/ImageReact'
// import HomeButton from '@/app/components/HomeButton'
import Navbar from '@/app/components/Navbar'
import { SinglePostCard } from '@/app/page'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { getUserData, useUserState } from '@/redux/slices/UserSlice'
import { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const ProfilePageParams = ({ params }: any) => {

    const themeMode = useThemeData().mode

    const { data: session, status } = useSession()

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()

    const { userData, allPostOfUser } = useUserState()

    // console.log(status)


    useEffect(() => {

        if (status === "unauthenticated") {

            toast.error("You are unauthenticated person.")
            router.push("/")
        }

    }, [session])



    useEffect(() => {

        // console.log(params.id)

        if (params.id) {

            dispatch(getUserData(params.id))

        }


    }, [])




    return (
        <div
            className={`w-full min-h-screen flex flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"} `}
        >

            {/* <HomeButton /> */}


            <Navbar />

            {/* 
            <div className='border p-2 rounded my-20 flex flex-col flex-wrap justify-center items-center'>
                <p>User Profile</p>
                <p><span className=' rounded px-2 bg-orange-500 text-black mx-2 font-semibold'>{params.id}</span></p>

                <p className=' mt-5'>Welcome, {session?.user?.name}</p>

                <ImageReact
                    className=" w-24 border rounded-full mt-2"
                    src={session?.user?.image?.toString()!}
                    alt=""
                />
            </div> */}



            <div className='border p-2 rounded my-5 flex flex-wrap justify-center items-center'>

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




            <div
                className=" my-10 card_container relative sm:px-[8vh] mt-16 flex gap-10 p-0.5 flex-wrap justify-center items-start "
            >

                {
                    allPostOfUser.length > 0

                    &&

                    allPostOfUser.map((ele) => {
                        return <SinglePostCard ele={ele} key={ele._id} />
                    })
                }

            </div>



        </div>
    )
}

export default ProfilePageParams
