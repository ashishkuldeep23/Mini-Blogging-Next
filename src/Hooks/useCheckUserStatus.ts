'use client'

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export function useCheckUserStatus() {

    const session = useSession()

    return function checkUserStatus(msg: string) {
        // console.log(session)

        if (!session?.data) {
            toast.error(msg)
            return false
        }
        return true
    }

}

