'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

const NotificationPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  useEffect(() => {
    // console.log(session?.user?.id)

    if (status === "unauthenticated") {
      toast.error("Plese Login.")
      router.push("/home")
    }


    if (status === 'authenticated' && session.user.image) {
      // setBgImages([...bgImage, `url('${session.user.image.toString()}')`])

      console.log("Fetch call here to  get data.")

    }

    // console.log(session?.user.image)

  }, [session, status])


  return (
    <div className=' text-white'>NotificationPage</div>
  )
}


export default NotificationPage;