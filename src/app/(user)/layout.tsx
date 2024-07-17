'use client'
import React, { useEffect, useRef, useState } from 'react';

import { CiCirclePlus } from "react-icons/ci";
import { FaCirclePlus } from "react-icons/fa6";
import { RiSearch2Line } from "react-icons/ri";
import { RiSearch2Fill } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiOutlineBackward } from "react-icons/hi2";
import { HiBackward } from "react-icons/hi2";

const LayoutPage = (
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) => {


    // const handlers = useSwipeable({
    //     // onSwipedLeft: () => alert("next"),
    //     onSwipedLeft: () => nextTab(),
    //     onSwipedRight: () => previousTab(),
    //     // Add other event handlers as needed
    // });

    // // // custome swipe fn() init here ---------------->
    const handlers = useSwipeCustom(previousTab, nextTab)
    // // // Swipe up and down also ----------->
    // const handlers = useSwipeCustom(previousTab, nextTab, () => alert("down"), () => alert("up"))

    const router = useRouter();

    const pathname = usePathname();

    const themeMode = useThemeData().mode

    const tabArr: SingleTabData[] = [
        // {
        //     icons: <CiHome />,
        //     name: "ashish",
        // },
        // {
        //     icons: <CgProfile />,
        //     name: "kuldeep",
        // },
        {
            name: "home",
        },
        {
            name: "search",
            icons: <RiSearch2Line />,
            activeIcon: <RiSearch2Fill />
        },
        {
            name: "create",
            icons: <CiCirclePlus />,
            activeIcon: <FaCirclePlus />,
        },
        {
            name: "notification",
            icons: <FaRegBell />,
            activeIcon: <FaBell />

        },
        {
            name: "profile",
            icons: <FaRegUser />,
            activeIcon: <FaUser />

        },
    ]


    // console.log(pathname);


    function nextTab() {

        let path = pathname.slice(1)

        let tabArrWithName = tabArr.map(e => e.name)
        let index = tabArrWithName.indexOf(path.toLowerCase())

        if (index === -1) {
            router.back()
        }

        else if (index === tabArrWithName.length - 1) {
            osmClickHangler(`/${tabArrWithName[0]}`)
        }
        else {
            osmClickHangler(`/${tabArrWithName[index + 1]}`)
        }



    }

    function previousTab() {

        let path = pathname.slice(1)
        let tabArrWithName = tabArr.map(e => e.name)
        let index = tabArrWithName.indexOf(path.toLowerCase())

        if (index === -1) {
            router.back()
        }

        else if (index === 0) {
            osmClickHangler(`/${tabArrWithName[tabArrWithName.length - 1]}`)
        }
        else {
            osmClickHangler(`/${tabArrWithName[index - 1]}`)
        }



    }


    const osmClickHangler = (ele: string) => {

        let body = document.querySelector('#main_visiable_for_user')

        body?.classList.add("page_transition");

        router.push(`${ele}`)

        setTimeout(() => {
            body?.classList.remove("page_transition");
        }, 700)

    }

    return (
        <div>

            <div
                className=" relative flex flex-col justify-center items-center pb-6 "
                {...handlers}
            >


                {/* <h1 className=' text-5xl text-cyan-400'>Swipe {swipeDirection}</h1> */}

                <Navbar />

                <div className=" relative flex items-start justify-center lg:w-[80%] gap-5 flex-col-reverse lg:flex-row">

                    <div className={`border-t lg:border-t-0 w-[100%] lg:w-[20%] flex lg:flex fixed -bottom-0.5 left-0 lg:sticky lg:top-7 lg:left-0 lg:bottom-auto p-1 lg:p-2 lg:rounded-md lg:m-1 border-gray-500/90 shadow-md z-10 ${themeMode ? " bg-white" : " bg-black"}  `}>

                        <ul className=' flex justify-between  gap-1 lg:block w-full mx-3 sm:mx-8 md:mx-14 lg:mx-0'>
                            {
                                tabArr.map((ele: SingleTabData, i) => {
                                    return <LiToJumpBWPage
                                        key={i}
                                        ele={ele}
                                        osmClickHangler={osmClickHangler}
                                    />
                                })
                            }


                            {
                                (tabArr.map(ele => ele.name).indexOf(pathname.slice(1)) === -1)
                                &&
                                <LiToJumpBWPage
                                    key={0}
                                    ele={{
                                        name: "back",
                                        icons: <HiOutlineBackward />,
                                        activeIcon: <HiBackward />
                                    }}
                                    osmClickHangler={() => router.back()}
                                />
                            }

                        </ul>
                    </div>


                    <div
                        id="main_visiable_for_user"
                        className=" relative w-[100%] lg:w-[60%] min-h-[90vh] p-1 mb-5 rounded-md border-gray-500/90  "
                    >
                        <div>
                            {children}
                        </div>



                        {/* Message div for Desktop like in LinkedIn, lg: is visiable point. And this will visiable only on home page */}

                        {
                            pathname === "/home"
                            &&

                            <div className=' hidden lg:block fixed bottom-2 right-[7vh] min-h-[60vh] min-w-[20vw] bg-rose-800 rounded-md border border-rose-400'>

                            </div>
                        }


                    </div>



                </div>




            </div>

        </div>
    )
}

export default LayoutPage






import { IoHomeSharp } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
import { useThemeData } from '@/redux/slices/ThemeSlice';
import Navbar from '../components/Navbar';
import useSwipeCustom from '@/utils/useSwipeCustom';


interface SingleTabData {
    name: string,
    icons?: React.ReactNode,
    activeIcon?: React.ReactNode,

};


function LiToJumpBWPage({ ele, osmClickHangler }: { ele: SingleTabData, osmClickHangler: Function }) {

    const router = useRouter()

    const pathname = usePathname()


    const [selectedPath, setSelectedPath] = useState<string>('')

    // console.log(selectedPath)

    useEffect(() => {
        pathname && setSelectedPath(pathname.slice(1))
    }, [pathname])


    // main_visiable_for_user
    return (
        <li
            // onClick={() => router.push(`/${ele.name}`)}
            onClick={() => osmClickHangler(`/${ele.name}`)}
            className={` relative w-7 lg:w-[100%] flex flex-col lg:flex-row lg:gap-1 items-center p-1 lg:px-3 lg:py-2 my-0 lg:my-3 text-xl text-white  lg:border border-gray-500/90 rounded-md hover:cursor-pointer transition-all
                ${selectedPath === ele.name && " font-bold scale-110"}
            `}
        >
            {
                selectedPath === ele.name
                    ?
                    <span>{ele.activeIcon || <IoHomeSharp />} </span>
                    :
                    <span>{ele.icons || <IoHomeOutline />} </span>
            }
            <span className={`inline capitalize text-[0.5rem] lg:text-xl leading-[0.8rem] lg:leading-none 
                 ${selectedPath === ele.name && " font-bold scale-125 text-sky-600 lg:ml-2.5"}
                
                `}>{ele.name}</span>
        </li>
    )
}
