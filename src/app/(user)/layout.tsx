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
import { IoHomeSharp } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
import { useThemeData } from '@/redux/slices/ThemeSlice';
import Navbar from '../components/Navbar';
import useSwipeCustom from '@/Hooks/useSwipeCustom';



type PostitionType = {
    top: string,
    left: string,
    width?: string,
    height?: string
}

// // // This is screen sizw for lagre display
const LgBreakValue = 1024;


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


    const [postionOfFirstLi, setPostionOfFirstLi] = useState<PostitionType>({ top: '0px', left: '0px' })

    let dont_show_nav_for_pages: string[] = ['/search', '/create']

    // console.log({ pathname })

    const [sliderVisiable, setSliderVisiable] = useState<'hidden' | 'inline'>('inline')
    // // // remove slider when other page is open 
    useEffect(() => {
        if (pathname) {
            let arr = tabArr.map(ele => ele.name)

            // console.log(pathname)
            // console.log(arr)

            if (!arr.includes(`${pathname.substring(1)}`)) {
                setSliderVisiable('hidden')
            } else {
                setSliderVisiable('inline')
            }

        }
    }, [pathname])


    // // // screen size code -------------------->
    useEffect(() => {

        if (window && window.innerWidth >= LgBreakValue) {
            // // // Desktop View ------------>>
            setPostionOfFirstLi({ ...postionOfFirstLi, width: "100%" })

        } else {
            // // // Mobile view ---------------->>
            setPostionOfFirstLi({ ...postionOfFirstLi, width: "2.5rem" })
        }

    }, [])


    return (
        <div
            className={`relative flex flex-col justify-center items-center pb-6 ${themeMode ? " bg-white" : " bg-black"}`}
            {...handlers}
        >

            {/* <h1 className=' text-5xl text-cyan-400'>Swipe {swipeDirection}</h1> */}

            {
                // pathname

                <Navbar
                    className={dont_show_nav_for_pages.includes(pathname) ? " !invisible !-top-10" : ""}
                />
            }

            <div className=" relative flex items-start justify-center lg:w-[80%] gap-5 flex-col-reverse lg:flex-row">

                <div className={`border-t lg:border-t-0 w-[100%] lg:w-[20%] flex lg:flex fixed -bottom-0.5 left-0 lg:sticky lg:top-7 lg:left-0 lg:bottom-auto p-1 lg:p-2 lg:rounded-md lg:m-1 border-gray-500/90 shadow-md z-30 ${themeMode ? " bg-white" : " bg-black"}  `}>

                    <ul className=' relative flex justify-between  gap-1 lg:block w-full mx-3 sm:mx-8 md:mx-14 lg:mx-0'>

                        {/* This li is used as slider in ui. */}
                        <li
                            style={{
                                top: postionOfFirstLi.top,
                                left: postionOfFirstLi.left,
                                width: postionOfFirstLi.width,
                                height: postionOfFirstLi.height

                            }}
                            className={` absolute   h-1 rounded-full bg-sky-600 transition-all duration-700 ${sliderVisiable}`}
                        ></li>

                        {
                            tabArr.map((ele: SingleTabData, i) => {
                                return <SingleTabLi
                                    key={i}
                                    ele={ele}
                                    osmClickHangler={osmClickHangler}
                                    setPostionOfFirstLi={setPostionOfFirstLi}
                                />
                            })
                        }

                        {/* This is back btn  */}
                        {/* Dont show this for mobile means below then lg: screen size. */}
                        {
                            (tabArr.map(ele => ele.name).indexOf(pathname.slice(1)) === -1)
                            &&
                            <SingleTabLi
                                key={0}
                                osmClickHangler={() => router.back()}

                                className={" !none lg:!inline-flex"}

                                display={(window && window.innerWidth >= LgBreakValue) ? "inline-flex" : "none"}

                                setPostionOfFirstLi={setPostionOfFirstLi}
                                ele={{
                                    name: "back",
                                    icons: <HiOutlineBackward />,
                                    activeIcon: <HiBackward />
                                }}

                            />
                        }

                    </ul>
                </div>

                {/* Main UI div here ----------> */}
                <div
                    id="main_visiable_for_user"
                    className=" relative w-[100%] lg:w-[60%] min-h-[90vh] p-1 mb-5 rounded-md border-gray-500/90  "
                >
                    {/* This div will conatain main UI as children */}
                    <div className=' mb-5 '>
                        {children}
                    </div>


                    {/* Message div for Desktop like in LinkedIn, lg: is visiable point. And this will visiable only on home page */}

                    {
                        pathname === "/home"
                        &&

                        <div className=' hidden lg:block fixed bottom-2 lg:right-0 xl:right-[7vh] min-h-[60vh] min-w-[20vw] bg-rose-800 rounded-md border border-rose-400'>

                        </div>
                    }


                </div>

            </div>


        </div>
    )
}

export default LayoutPage


interface SingleTabData {
    name: string,
    icons?: React.ReactNode,
    activeIcon?: React.ReactNode,
    className?: string,

};


import { CiLock } from "react-icons/ci";
import { useUserState } from '@/redux/slices/UserSlice';
import ImageReact from '../components/ImageReact';

function SingleTabLi({ ele, osmClickHangler, setPostionOfFirstLi, className, display }: { ele: SingleTabData, osmClickHangler: Function, setPostionOfFirstLi: Function, className?: string, display?: string }) {

    // const router = useRouter()

    const userId = useUserState().userData._id
    const userImg = useUserState().userData.profilePic

    const pathname = usePathname()

    const [selectedPath, setSelectedPath] = useState<string>('')

    const themeMode = useThemeData().mode

    // console.log(selectedPath)

    useEffect(() => {
        pathname && setSelectedPath(pathname.slice(1))
    }, [pathname])

    let publicPages = ['home', "search", 'back']


    const liRef = useRef<HTMLLIElement | null>(null)

    useEffect(() => {

        if (ele.name === selectedPath && liRef.current) {

            let top = liRef.current.getBoundingClientRect().top
            let left = liRef.current.getBoundingClientRect().left

            // console.log(liRef.current.getBoundingClientRect().width)
            // console.log()

            const width = liRef.current.getBoundingClientRect().width
            const hight = liRef.current.getBoundingClientRect().height;


            // console.log("ref ----------->>" , liRef.current.children[1].getBoundingClientRect().width)


            if (window && window.innerWidth >= LgBreakValue) {
                // // // Desktop View ------------>


                // // // Old using this ------------->
                // setPostionOfFirstLi({ top: `${top - 33}px`, left: `${-11}px` })

                let tabNameWidth = liRef.current.children[1].getBoundingClientRect().width
                let tabNameHeight = liRef.current.children[1].getBoundingClientRect().height

                setPostionOfFirstLi({ top: `${top - 72}px`, left: `${-10}px`, width: '5px', height: `${tabNameHeight * 1.5}px` })

            } else {
                // // // Mobile View here ------------>

                // // // Old using this ------------->
                // setPostionOfFirstLi({ top: `${-7}px`, left: `${left - 18.5}px` })

                let tabNameWidth = liRef.current.children[1].getBoundingClientRect().width
                let tabNameLeft = liRef.current.children[1].getBoundingClientRect().left

                setPostionOfFirstLi({ top: `${-6}px`, left: `${tabNameLeft - 15.5}px`, width: `${tabNameWidth}px` })
            }

        }

    }, [ele.name, selectedPath])



    // main_visiable_for_user
    return (
        <li
            ref={liRef}
            style={{ display: display }}
            // onClick={() => router.push(`/${ele.name}`)}
            onClick={() => osmClickHangler(`/${ele.name}`)}
            className={` relative w-7 lg:w-[100%] flex flex-col lg:flex-row lg:gap-1 items-center p-1 lg:px-3 lg:py-2 my-0 lg:my-3 text-xl lg:border border-gray-500/90 rounded-md hover:cursor-pointer transition-all hover:scale-y-110 lg:hover:scale-x-110 duration-300
                ${selectedPath === ele.name && " font-bold scale-110"}
                ${!themeMode ? " text-white" : " text-black "}
            `}
        >
            {

                ele.name === "profile"
                    ?
                    <>
                        {
                            userImg
                                ?

                                <ImageReact src={userImg} className='h-5 w-5 object-cover rounded-full ring-1 p-[1px] ring-sky-600' />

                                :
                                <span>{ele.icons || <IoHomeOutline />} </span>

                        }
                    </>
                    :
                    <>
                        {



                            selectedPath === ele.name
                                ?
                                <span className=' text-sky-600'>{ele.activeIcon || <IoHomeSharp />} </span>
                                :
                                <span>{ele.icons || <IoHomeOutline />} </span>
                        }
                    </>

            }


            {/* Lock icon and Name of tab here -----------------> */}
            <span className={` mx-0.5 inline-flex gap-1 justify-center items-center capitalize text-[0.5rem] lg:text-xl leading-[0.8rem] lg:leading-none 
                 ${selectedPath === ele.name && " font-[cursive] font-bold scale-125 text-sky-600 lg:ml-2.5"}
                
                `}>

                {ele.name}

                {
                    (!userId) && (!publicPages.includes(ele.name))
                    &&
                    <CiLock className=' text-xs' />
                }


            </span>

        </li>
    )
}
