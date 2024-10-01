'use client'


import React, { useEffect } from 'react'
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LayoutPage = (
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) => {


    const session = useSession()

    const router = useRouter()


    // console.log(session)

    useEffect(() => {

        if (session.status === 'unauthenticated') {

            router.push('/home')
        }

    }, [])

    return (
        <div>

            <Navbar />

            <div className='  w-full h-16 flex justify-center items-center border-2 text-rose-500 border-rose-500 rounded'>
                <p className=' '>Go to general Chat BTN here</p>
            </div>
            <div className='p-1 '>{children}</div>

        </div>
    )
}

export default LayoutPage