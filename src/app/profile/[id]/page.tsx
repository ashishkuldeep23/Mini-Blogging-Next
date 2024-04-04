
'use client'

import ImageReact from '@/app/components/ImageReact'
// import HomeButton from '@/app/components/HomeButton'
import Navbar from '@/app/components/Navbar'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ProfilePageParams = ({ params }: any) => {

    const themeMode = useThemeData().mode

    const { data: session, status } = useSession()

    const router = useRouter()

    // console.log(status)


    useEffect(() => {

        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [session])



    return (
        <div
            className={`w-full h-screen flex flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"} `}
        >

            {/* <HomeButton /> */}


            <Navbar />


            <div className='border p-2 rounded my-20 flex flex-col flex-wrap justify-center items-center'>
                <p>User Profile</p>
                <p><span className=' rounded px-2 bg-orange-500 text-black mx-2 font-semibold'>{params.id}</span></p>

                <p className=' mt-5'>Welcome, {session?.user?.name}</p>

                <ImageReact
                    className=" w-24 border rounded-full mt-2"
                    src={session?.user?.image?.toString()!}
                    alt=""
                />


            </div>

        </div>
    )
}

export default ProfilePageParams
