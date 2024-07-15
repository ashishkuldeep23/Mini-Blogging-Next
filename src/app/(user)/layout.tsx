'use client'
import React from 'react'

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
import { useRouter } from 'next/navigation';


interface SingleTabData {
    name: string,
    icons?: React.ReactNode,

};


function LeftNavDesktop() {


    const router = useRouter()

    return (
        <div className=" border-t lg:border-t-0 w-[100%] lg:w-[20%] flex lg:flex fixed top-[90%] left-0 lg:sticky lg:top-0 lg:left-0 lg:p-2 lg:rounded-md lg:m-1 border-gray-500/90 shadow-md z-10 ">

            <ul className=' flex justify-between  gap-1 lg:block w-full'>
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
            className="lg:w-[100%] flex flex-col lg:flex-row lg:gap-1 items-center px-3 py-2 my-1 lg:my-3 text-xl text-white  lg:border border-gray-500/90 rounded-md hover:cursor-pointer transition-all"
        >
            <span>{ele.icons || <CiHome />} </span>
            <span className=' inline capitalize text-[0.5rem] lg:text-xl'>{ele.name}</span>
        </li>
    )
}
