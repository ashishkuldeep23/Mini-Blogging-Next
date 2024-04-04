
'use client'


// import React from 'react'

const SlugIdPage = ({ params }: {
    params: { id: string }
}) => {


    // console.log(typeof params.id)
    // console.log(+params.id > 100)


    if (+params.id > 100) {
        return (

            <div className=" w-full h-screen flex justify-center items-center">
                <h1 className=" text-4xl">Slug Id more then, {params.id}</h1>
            </div>
        )
    }


    return (
        <>

            <div className=" w-full h-screen flex justify-center items-center">
                <h1 className=" text-4xl">Slug Id {params.id}</h1>
            </div>

        </>
    )
}

export default SlugIdPage

