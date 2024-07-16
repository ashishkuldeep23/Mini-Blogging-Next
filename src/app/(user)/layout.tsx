'use client'
import React, { useEffect, useState } from 'react'

const LayoutPage = (
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) => {
    return (
        <div>

            <div className=" flex flex-col justify-center items-center pb-6 ">

                <div className=" relative flex items-start lg:w-[80%] gap-5 flex-col-reverse lg:flex-row">

                    <LeftNavDesktop />

                    <div
                        id="main_visiable_for_user"
                        className="w-[100vw] lg:w-[75%] min-h-[90vh] my-5 p-1 rounded-md border-gray-500/90 lg:border "
                    >
                        {children}
                    </div>

                </div>

            </div>

        </div>
    )
}

export default LayoutPage






import { CiHome } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from 'next/navigation';


interface SingleTabData {
    name: string,
    icons?: React.ReactNode,

};


function LeftNavDesktop() {


    const router = useRouter()

    return (
        <div className=" border-t lg:border-t-0 w-[100%] lg:w-[20%] flex lg:flex fixed -bottom-0.5 left-0 lg:sticky lg:top-0 lg:left-0 lg:bottom-auto lg:p-2 lg:rounded-md lg:m-1 border-gray-500/90 shadow-md z-10 ">

            <ul className=' flex justify-between  gap-1 lg:block w-full mx-2 sm:mx-8 md:mx-14 lg:mx-0'>
                {
                    [
                        {
                            icons: <CiHome />,
                            name: "ashish",
                        },
                        {
                            icons: <CgProfile />,
                            name: "kuldeep",
                        },
                        {
                            name: "home",
                        },
                        {
                            name: "create",
                        },
                        {
                            name: "notification",
                        },
                    ].map((ele: SingleTabData, i) => {
                        return <LiToJumpBWPage key={i} ele={ele} />
                    })
                }
            </ul>
        </div>
    )
}


function LiToJumpBWPage({ ele }: { ele: SingleTabData }) {

    const router = useRouter()

    const pathname = usePathname()


    const [selectedPath, setSelectedPath] = useState<string>('')

    // console.log(selectedPath)

    useEffect(() => {
        pathname && setSelectedPath(pathname.slice(1))
    }, [pathname])


    const omClickHangler = () => {

        let body = document.querySelector('#main_visiable_for_user')

        body?.classList.add("page_transition");

        router.push(`/${ele.name}`)

        setTimeout(() => {
            body?.classList.remove("page_transition");
        }, 700)

    }

    // main_visiable_for_user
    return (
        <li
            // onClick={() => router.push(`/${ele.name}`)}
            onClick={omClickHangler}
            className={` relative w-7 lg:w-[100%] flex flex-col lg:flex-row lg:gap-1 items-center p-1 lg:px-3 lg:py-2 my-0 lg:my-3 text-xl text-white  lg:border border-gray-500/90 rounded-md hover:cursor-pointer transition-all

                ${selectedPath === ele.name && " font-bold scale-110"}
                
                `}
        >
            <span>{ele.icons || <CiHome />} </span>
            <span className={`inline capitalize text-[0.5rem] lg:text-xl leading-[0.8rem] lg:leading-none 
                 ${selectedPath === ele.name && " font-bold scale-125 text-sky-600 lg:ml-2.5"}
                
                `}>{ele.name}</span>
        </li>
    )
}
