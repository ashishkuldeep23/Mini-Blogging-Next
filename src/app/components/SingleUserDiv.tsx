
'use client'

import { AddMoreFeilsUserData, FriendsAllFriendData } from "@/Types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AnimatedTooltip from "./ui/animated-tooltip"
import { PiSealCheckDuotone } from "react-icons/pi"
import { IoCheckmarkDoneOutline } from "react-icons/io5"
import { RiUserAddLine } from "react-icons/ri"

export default function SingleUserDiv(
    {
        friend,
        i,
        userData,
        addFriend
    }: {
        friend: FriendsAllFriendData,
        i: number,
        userData: AddMoreFeilsUserData,
        addFriend: Function
    }

) {

    const router = useRouter()

    function goToUserProfile() {
        router.push(`/user/${friend._id}`)
    }

    return (
        <div
            key={friend._id}
            className={`px-0.5 py-1 border-b flex items-center justify-between ${i === 0 && "border-t"} `}
        >

            <div
                className=' flex gap-1 flex-wrap items-center hover:cursor-pointer '
                onClick={() => { goToUserProfile() }}
            >
                <div className=' relative flex'>
                    <AnimatedTooltip
                        items={
                            [
                                {
                                    id: 1,
                                    name: friend.username,
                                    designation: friend.email,
                                    image: friend.profilePic,
                                    onClickFunction: (() => { goToUserProfile() })
                                }

                            ]
                        }
                    />
                </div>

                <div className='ml-5 flex flex-col leading-5'>
                    <p className='  font-semibold capitalize flex gap-1 items-end'>
                        {
                            friend.username
                        }

                        {
                            friend.isVerified
                            &&
                            <span className="mr-2 mt-2.5 text-green-500 ">
                                <PiSealCheckDuotone />
                            </span>
                        }

                    </p>

                    <p className='  text-sm font-extralight'>
                        {
                            friend.email
                        }
                    </p>
                </div>

            </div>


            <RightSectionOfSingleFriend
                friend={friend}
                userData={userData}
                addFriend={addFriend}
            />

        </div>
    )
}


function RightSectionOfSingleFriend(
    {
        friend,
        userData,
        addFriend
    }: {
        friend: FriendsAllFriendData,
        userData: AddMoreFeilsUserData,
        addFriend: Function
    }


) {



    const { data: session } = useSession()



    return (
        <div>


            {

                !session?.user?._id
                    ?
                    <span
                        className=' flex justify-center items-center border rounded-md p-0.5 active:scale-75 mt-2 hover:cursor-pointer'
                        onClick={() => { addFriend(friend._id) }}
                    >
                        <RiUserAddLine />
                        {/* Add friend logo */}
                    </span>

                    :
                    <>
                        {
                            session?.user?._id && userData.friendsAllFriend?.map(ele => ele._id).includes(friend._id)

                                ?
                                <span className=' text-xs text-green-500'>Friend</span>
                                :
                                <>
                                    {
                                        session?.user?._id && userData.sendRequest?.map(ele => ele._id).includes(friend._id)
                                            ?
                                            <span className=' text-green-500 '>
                                                <IoCheckmarkDoneOutline />
                                            </span>
                                            :
                                            <>

                                                {
                                                    session?.user._id === friend._id
                                                        ?
                                                        <span className=' text-xs text-violet-500 font-semibold'>You</span>
                                                        :

                                                        // // // Here you can put more conditions like you recived request from him ------->
                                                        <span
                                                            className=' flex justify-center items-center border rounded-md p-0.5 active:scale-75 mt-2 hover:cursor-pointer'
                                                            onClick={() => { addFriend(friend._id) }}
                                                        >
                                                            <RiUserAddLine />
                                                            {/* Add friend logo */}
                                                        </span>
                                                }
                                            </>

                                    }
                                </>

                        }
                    </>

            }


        </div>
    )

}
