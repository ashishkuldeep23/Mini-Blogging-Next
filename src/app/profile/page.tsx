
'use client'

import { useThemeData } from '@/redux/slices/ThemeSlice'
import React from 'react'
import HomeButton from '../components/HomeButton'

const ProfilePage = () => {


    const themeMode = useThemeData().mode

    return (
        <div
            className={`w-full h-screen flex flex-col justify-center items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"} `}
        >

            <HomeButton />
            
            <p>User</p>
            <p>ProfilePage</p>
        </div>
    )
}

export default ProfilePage
