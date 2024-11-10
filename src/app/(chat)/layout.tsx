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

            <div>{children}</div>

        </div>
    )
}

export default LayoutPage