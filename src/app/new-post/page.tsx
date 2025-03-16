'use client'

import { useThemeData } from '@/redux/slices/ThemeSlice';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createNewPost, setWriteFullFilledVal, usePostData, updatePost, setUpdatingPost, setIsLoading } from '@/redux/slices/PostSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import MainLoader from '../components/MainLoader';
import ImageReact from '../components/ImageReact';
import { FaCamera } from "react-icons/fa";
import { uploadFileInCloudinary } from '@/lib/cloudinary'
import { NewPostType, PostCustomization } from '@/Types';


const NewPostPage = () => {

    const dispatch = useDispatch<AppDispatch>()

    const themeMode = useThemeData().mode

    const { singlePostdata, updatingPost, writePostFullFilled, isLoading, errMsg } = usePostData()

    const router = useRouter()

    const { data: session, status } = useSession()

    // const { userData } = useUserState()

    const initialNewPostData: NewPostType = {
        title: "",
        category: "",
        content: "",
        url: "",
        origin: "",
        hashs: [],
        customize: {
            bgColor: "",
            color: "",
            bgImage: "",
            font: ""
        },
        image: ""
    }

    const [newPostData, setNewPostData] = useState<NewPostType>(initialNewPostData)

    const [newHash, setNewHash] = useState<string>("")

    type TypeCatAndHash = {
        categories: string[],
        hashthasts: string[]
    }

    const [catAndHash, setCatAndHash] = useState<TypeCatAndHash>({
        categories: ["Self Confidence", "vvv", "update6", "General"],
        hashthasts: ["#ok", "#bk", "#ck"]
    })

    const [plusCategory, setPlusCategory] = useState<{ mode: boolean, value: string }>({ mode: false, value: "" })

    const { postCategories, posthashtags } = usePostData();

    // console.log(router)


    // // // Customization added here ------------------>


    const initailCustomize = {
        bgColor: "",
        color: "",
        bgImage: "",
        font: ""
    }

    const [customize, setCutomize] = useState<PostCustomization>(initailCustomize)

    const [bgImage, setBgImages] = useState<Array<string>>([
        'url("https://www.transparenttextures.com/patterns/argyle.png")',
        'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        'url("https://www.transparenttextures.com/patterns/batthern.png")',
        'url("https://www.transparenttextures.com/patterns/cartographer.png")',
        'url("https://www.transparenttextures.com/patterns/checkered-pattern.png")',
        'url("https://www.transparenttextures.com/patterns/crisp-paper-ruffles.png")',
        'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        'url("https://www.transparenttextures.com/patterns/dark-mosaic.png")',
        'url("https://www.transparenttextures.com/patterns/diagmonds-light.png")',
        'url("https://www.transparenttextures.com/patterns/diagmonds.png")',
        'url("https://www.transparenttextures.com/patterns/food.png")',
        'url("https://www.transparenttextures.com/patterns/foggy-birds.png")'
    ])

    const [fontFamily] = useState<Array<string>>([
        'cursive',
        "emoji",
        "fangsong",
        'fantasy',
        'math',
        'monospace',
        'sans-serif',
        'system-ui',
        'serif'
    ])

    const [postImageUrl, setPostImageUrl] = useState<string>('')

    // console.log(postImageUrl)


    const [imageFile, setImageFile] = useState<File>()

    // console.log(imageFile)

    function addNewHash({
        e,
        text = newHash
    }: {
        e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>,
        text?: string
    }

    ) {
        e.preventDefault()
        e.stopPropagation()

        if (!text) return

        if (newPostData.hashs.length >= 5) {

            // console.log("Yes -----------> ")

            toast.error("You can only give 5 hashtags.");

            return
        }


        // // // Remove hash if already have ---->

        if (text[0] === "#") {

            // console.log("54564545")
            text = text.slice(1)
        }

        let newArr = [...newPostData?.hashs, `#${text.toLowerCase()}`]
        let uniqueArr = new Set(newArr)

        // console.log([...uniqueArr])

        setNewPostData({
            ...newPostData,
            hashs: [...uniqueArr]
        })

        setNewHash("")
    }

    function cutOneHash(index: number) {

        newPostData.hashs.splice(index, 1)
        setNewPostData({
            ...newPostData,
            hashs: newPostData.hashs
        })
    }


    function selectOnChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {

        if (e.target.value === "plus") {

            setNewPostData({ ...newPostData, category: "" })

            setPlusCategory({ ...plusCategory, mode: true })

        } else {


            setPlusCategory({ value: "", mode: false })

            setNewPostData({ ...newPostData, category: e.target.value })

        }

    }


    function imgInputOnchangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        e.preventDefault();

        if (e.target.files) {

            const file = e?.target?.files[0]

            // // // Here now set file ---------->
            // File size should less then 2 mb. 
            if (file.size > 2097152) {
                return toast.error("File size should less then 2 mb")
            }

            setImageFile(file)
            // // // Show img direct by here --->
            setPostImageUrl(URL.createObjectURL(file))


        }

    }



    async function submitFormData(even: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        even.preventDefault()

        // console.log(session)

        if (status === "unauthenticated") {
            router.push("/")
        }

        if (session?.user?.id) {


            // // // Do 3 things here --------->
            // 1. check any file is present.
            // 2. Upload file into cloudinary.
            // 3. set file url to newPostData inside image key.

            let imageUrl = "";

            if (imageFile) {

                dispatch(setIsLoading(true))

                // // Now here we can uplaod file 2nd step ------>
                imageUrl = await uploadFileInCloudinary(imageFile)
                // console.log({ imageUrl })

                /// // // now set url of image -------->
                setNewPostData({ ...newPostData, image: imageUrl })
            }




            if (updatingPost && singlePostdata?._id) {

                // alert("now call dispatch for update.")

                dispatch(updatePost({
                    body: { ...newPostData, image: newPostData.image || imageUrl },
                    userId: session?.user?.id,
                    postId: singlePostdata?._id
                }))
            } else {


                dispatch(createNewPost({
                    body: { ...newPostData, image: imageUrl },
                    userId: session?.user?.id
                }))
            }


        }
        else {

            toast.error("Plese Login again.")
            router.push("/login")
        }


    }




    // // // DO THIS ON REDUX --------->

    // async function updatePost() {
    //     // // // when post is updated ------>
    //     // dispatch(setSinglePostdata(post))
    //     // dispatch(setUpdatingPost(true))
    // }

    // // // Update customization here ------>

    useEffect(() => {

        // console.log(newPostData)

        setNewPostData({ ...newPostData, customize: customize })

    }, [customize])


    // // // Check user is loged in or not and also set 
    useEffect(() => {
        // console.log(session?.user?.id)

        if (status === "unauthenticated") {
            toast.error("Plese Login again.")
            router.push("/")
        }


        if (status === 'authenticated' && session.user.image) {
            setBgImages([...bgImage, `url('${session.user.image.toString()}')`])
        }

        // console.log(session?.user.image)

    }, [session, status])


    // useEffect(() => {

    //     if (userData._id && session?.user.image) {
    //         // setBgImages([...bgImage, `url('${userData?.profilePic.toString()}')`])

    //         // console.log(session?.user.image)
    //     }
    // }, [userData])


    useEffect(() => {

        if (writePostFullFilled) {

            // // // back to normal everything -------->
            setNewPostData(initialNewPostData)

            dispatch(setUpdatingPost(false))
            dispatch(setWriteFullFilledVal(false))
            // router.push("/")


            // router.back()
            // // // some logic here -------->
            // // Checking post got updated or created ---->
            if (errMsg === 'Post updated successfully.') {
                router.push(`/post/${singlePostdata?._id}`)
            } else {
                router.push("/")
            }


        }

    }, [writePostFullFilled])

    // console.log(catAndHash.hashthasts)
    // console.log(catAndHash.categories)


    useEffect(() => {

        // console.log('from new post page ---> ', posthashtags)

        // if (posthashtags.length > 0) {
        //     setCatAndHash({ categories: catAndHash.categories, hashthasts : [...posthashtags] })
        // }

        if (postCategories.length > 0) {
            setCatAndHash({ hashthasts: posthashtags, categories: postCategories })

            setNewPostData({ ...newPostData, category: postCategories[0] })
        }

    }, [postCategories, posthashtags])



    // // // Update post here =============> 
    useEffect(() => {

        if (updatingPost && singlePostdata?._id) {


            setNewPostData(
                {
                    title: singlePostdata?.title,
                    category: singlePostdata?.category,
                    content: singlePostdata?.promptReturn,
                    url: singlePostdata?.urlOfPrompt,
                    origin: singlePostdata?.aiToolName,
                    hashs: [...singlePostdata?.hashthats],
                    customize: singlePostdata?.customize,
                    image: singlePostdata?.image
                }
            );

            if (singlePostdata.customize) {
                setCutomize(singlePostdata?.customize)
            }

            if (singlePostdata?.image) {
                setPostImageUrl(singlePostdata?.image)
            }


        }


    }, [singlePostdata])


    // // // Some common class name that used in input fields ------->  
    const classNamesForInputs = ` w-[68%] border rounded-sm px-1 ${!themeMode ? " bg-slate-900 text-white" : " bg-slate-100 text-black"}`


    return (
        <>

            <div
                className={`w-full min-h-screen flex flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}
            >

                <MainLoader isLoading={isLoading} />

                <Navbar />

                <div className='my-14 flex flex-col items-center w-full '>

                    <p className=' my-2 border-b px-4 text-xl font-semibold'>Create a new post here👇</p>

                    <div className={`rounded flex flex-col border w-11/12 xs:w-[80%]  sm:w-3/4 md:w-2/3 
                    ${themeMode ? ` ${!updatingPost ? "bg-green-100" : "bg-rose-100"}` : ` ${!updatingPost ? "bg-green-950" : "bg-rose-950"}`} 
                    `}>

                        <div
                            className='rounded mt-2 flex p-1 gap-2 flex-col sm:flex-row'
                        >

                            <div
                                className={`rounded p-1 border w-full sm:w-3/5 ${!themeMode ? " bg-black" : " bg-white"}`}
                            >

                                <form
                                    className=' flex flex-col gap-2'
                                    onSubmit={(e) => { submitFormData(e) }}
                                >


                                    <div className=''>
                                        <input
                                            className={`${classNamesForInputs}`}
                                            placeholder="Give title of post"
                                            type={"text"}
                                            id="title"
                                            value={newPostData?.title}
                                            name='title'
                                            onChange={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setNewPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }))
                                            }}
                                        />

                                        <label
                                            className=' pl-2 pr-1 border-b font-semibold'
                                            htmlFor="title"
                                        >Title</label>

                                    </div>


                                    <div>

                                        <textarea
                                            style={{ resize: "none" }}
                                            placeholder="Give content of post"
                                            className={`${classNamesForInputs}`}
                                            id="content"
                                            rows={3}

                                            value={newPostData?.content}
                                            name='content'
                                            onChange={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setNewPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }))
                                            }}
                                        ></textarea>

                                        <label
                                            className='pl-2 pr-1 border-b font-semibold'
                                            htmlFor="content"
                                        >Content</label>

                                    </div>


                                    {/* // // // // New category look like -------> */}
                                    <div className=" w-full px-0.5 flex flex-col ">

                                        <div className=' felx'>


                                            <select
                                                onChange={(e) => {
                                                    selectOnChangeHandler(e)
                                                }}
                                                // {...register("category", { required: "Category is Required" })}
                                                // className=" text-black font-bold rounded capitalize py-1"

                                                className={`${classNamesForInputs} my-1`}
                                                name="" id="category_product"
                                                value={newPostData.category ? newPostData.category : ''}
                                            >

                                                {
                                                    catAndHash.categories.length
                                                    &&
                                                    catAndHash.categories.map((category, i) => {
                                                        return (
                                                            <option
                                                                // {...register("category", { required: "Category is Required" })}

                                                                // selected={getValues("category") === category ? true : false}

                                                                key={i}
                                                                className="capitalize"
                                                                value={`${category}`}
                                                            >{
                                                                    category
                                                                }</option>
                                                        )
                                                    })
                                                }



                                                {/* Plus option for new category -----> */}

                                                <option
                                                    value="plus"
                                                    onClick={() => {

                                                        // setPlusCategory(true) 
                                                    }}
                                                // onClick={()=>setPlusCategory(true)}
                                                // {...register("category", { required: "Category is Required" })}
                                                >+Plus</option>


                                            </select>

                                            <label
                                                htmlFor="category_product"
                                                className='pl-2 pr-1 border-b font-semibold'
                                            >
                                                Category
                                            </label>

                                        </div>


                                        {/* Add new category All code ----> */}


                                        {

                                            plusCategory.mode
                                            &&
                                            // // Take new category input here --->
                                            <div className=" flex flex-col flex-wrap " >

                                                {/*value get this input ---> */}

                                                <div className=' flex items-center'>

                                                    <input
                                                        id="category_product" type="text"
                                                        placeholder="Give new category here"
                                                        // className={`block rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${!themeMode ? " bg-white text-gray-900 " : "bg-gray-900 text-white"}`}

                                                        value={plusCategory.value}

                                                        className={`${classNamesForInputs}`}
                                                        // value={plusCategoryInput.typing}
                                                        onChange={(e) => {
                                                            setPlusCategory({ ...plusCategory, value: e.target.value })

                                                        }}
                                                    />

                                                    <button
                                                        className="border h-full px-1 rounded m-0.5"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            // setPlusCategoryInput({ typing: "", added: plusCategoryInput.typing });
                                                            // setValue("category", `${plusCategoryInput.typing}`)

                                                            setNewPostData({ ...newPostData, category: plusCategory.value.trim() })



                                                        }}
                                                    >+Add</button>


                                                </div>

                                                <div className=" flex flex-wrap items-center">

                                                    {
                                                        // plusCategoryInput.added
                                                        // &&
                                                        <p
                                                            style={{ lineBreak: "anywhere" }}
                                                            className="mx-2"
                                                        >
                                                            New Category added:
                                                            <span
                                                                className=" capitalize bg-green-400 font-semibold border px-0.5 rounded "
                                                            >{newPostData.category}</span></p>
                                                    }

                                                    {
                                                        // !plusCategoryInput.added
                                                        // &&

                                                    }


                                                </div>

                                            </div>

                                        }


                                    </div>

                                    {/* Here going to take an file uplad image ------> */}


                                    <div className=" flex justify-start">

                                        <div className=' w-[68%]' >

                                            <input
                                                className={`${classNamesForInputs} hidden`}
                                                type="file"
                                                name=""
                                                accept="image/png, image/png, image/jpeg"
                                                id="change_img"
                                                onChange={(e) => { imgInputOnchangeHandler(e) }}
                                            />

                                            {/* <i className={`ri-camera-3-line text-6xl sm:text-8xl`}></i> */}

                                            <div
                                                className={`${classNamesForInputs} w-full  `}
                                            >

                                                <label

                                                    className=' flex  justify-start pl-1 gap-2 flex-wrap'
                                                    htmlFor="change_img">
                                                    <FaCamera className=' mx-auto sm:mx-0 text-2xl' />
                                                    <p>Choose an image for post.</p>
                                                </label>

                                            </div>

                                        </div>


                                        <label
                                            className=' pl-2 pr-1 border-b font-semibold'
                                            htmlFor="change_img"
                                        >*Image</label>


                                        {/* <div >
                                            <label htmlFor="change_img" className='text-green-500'>After changing click submit </label>
                                            <button className="bg-green-500 px-1 rounded text-white font-bold" onClick={(e) => {
                                                e.stopPropagation();
                                                // submitNewImg(); 
                                            }}>☝️Upload</button>
                                        </div> */}

                                    </div>




                                    <div>
                                        <input
                                            className={`${classNamesForInputs}`}
                                            placeholder="Give url of post"
                                            type={"text"}
                                            id="url"
                                            value={newPostData?.url}
                                            name='url'
                                            onChange={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setNewPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }))
                                            }}
                                        />

                                        <label
                                            className=' pl-2 pr-1 border-b font-semibold'
                                            htmlFor="url"
                                        >*Url</label>

                                    </div>


                                    <div>
                                        <input
                                            className={`${classNamesForInputs}`}
                                            placeholder="Give origin of post"
                                            type={"text"}
                                            id="origin"
                                            value={newPostData?.origin}
                                            name='origin'
                                            onChange={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setNewPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }))
                                            }}
                                        />

                                        <label
                                            className=' pl-2 pr-1 border-b font-semibold'
                                            htmlFor="origin"
                                        >*Origin</label>

                                    </div>


                                    <div>

                                        <div className={` ${!themeMode ? "text-violet-300" : "text-violet-700"} flex flex-wrap items-center gap-1`}>

                                            {
                                                newPostData.hashs.map((ele, i) => {
                                                    return (
                                                        <p
                                                            key={i}
                                                            className=' border border-cyan-400 pl-2 rounded-md'
                                                        >{ele}
                                                            <span
                                                                onClick={() => cutOneHash(i)}
                                                                className='bg-red-500 rounded-full font-semibold px-1 mx-1 text-white hover:cursor-pointer hover:bg-red-700 '
                                                            >x</span>
                                                        </p>
                                                    )
                                                })
                                            }
                                        </div>


                                        <div className='my-1 flex'>

                                            <div
                                                className={` relative flex justify-end w-[68%] border rounded `}
                                            // className={`flex  `}
                                            >


                                                <input
                                                    className={`${classNamesForInputs} w-full relative z-10 rounded-e-none `}
                                                    placeholder="Give HasThats of post"
                                                    type={"text"}
                                                    id="HasThats"
                                                    name="HasThats"
                                                    value={newHash}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setNewHash(() => e.target.value)
                                                    }
                                                    }

                                                    onKeyDown={(e) => {
                                                        // e.preventDefault();
                                                        // console.log(e.key)
                                                        if (e.key === "Enter") {
                                                            addNewHash({ e })
                                                        }
                                                    }}

                                                />

                                                <button
                                                    className=' -ml-1 mb-0.5 scale-y-[1.6] scale-x-125'
                                                    onClick={(e) => {
                                                        // e.preventDefault()
                                                        addNewHash({ e })
                                                    }}
                                                >⬆️</button>


                                                {
                                                    // // // Suggetion div with logic here ---------->

                                                    newHash
                                                    &&

                                                    <div className={`absolute z-[1] top-[110%] rounded w-full px-0.5 ${!themeMode ? "bg-black" : "bg-white"} `}>

                                                        {

                                                            catAndHash.hashthasts
                                                                .filter((ele) => ele.includes(newHash))

                                                                .map((ele, i) => {
                                                                    return (
                                                                        <>

                                                                            {
                                                                                ele
                                                                                &&
                                                                                <div
                                                                                    className=' border-b'
                                                                                    key={i}
                                                                                    onClick={() => {

                                                                                        newPostData.hashs.push(ele)

                                                                                        // console.log(newPostData.hashs)

                                                                                        setNewPostData({
                                                                                            ...newPostData,
                                                                                            hashs: newPostData.hashs
                                                                                        });
                                                                                        setNewHash("");
                                                                                    }}
                                                                                >{ele}</div>

                                                                            }
                                                                        </>
                                                                    )
                                                                })



                                                        }

                                                    </div>
                                                }


                                            </div>


                                            <label
                                                className=' pl-2 pr-1 border-b font-semibold'
                                                htmlFor="HasThats"
                                            >*Hasthats</label>

                                        </div>


                                    </div>

                                </form>

                                <p className=' text-center'>star(*) marked are optional.</p>

                            </div>



                            {/* UI of given data shown here -------> */}

                            <div
                                className={` relative overflow-hidden rounded p-1 border w-full sm:w-2/5 ${!themeMode ? " bg-black" : " bg-white"}`}
                                style={{
                                    backgroundColor: customize.bgColor,
                                    color: customize.color,
                                    backgroundImage: customize.bgImage,
                                    fontFamily: `${customize.font} , sans-serif`,

                                    // // // added more style if user choosed profile pic as bg of post ------>
                                    backgroundRepeat: `url('${session?.user.image}')` === `${customize.bgImage}` ? "no-repeat" : "",
                                    backgroundPosition: `url('${session?.user.image}')` === `${customize.bgImage}` ? 'center' : "",
                                    backgroundSize: `url('${session?.user.image}')` === `${customize.bgImage}` ? "cover" : "",
                                }}
                            >


                                <div className="rounded-t flex gap-1.5 items-center border-b border-cyan-400">

                                    <ImageReact
                                        className=" rounded-full w-8 h-8 aspect-square object-cover"
                                        src={`${session?.user.image || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                                        alt=""
                                    />
                                    <p className=' font-semibold capitalize'>{session?.user.name || "Name Kumar"}</p>
                                </div>

                                <div className=" flex justify-between flex-wrap gap-1">
                                    <p className=" capitalize">{newPostData.title}</p>

                                    {
                                        newPostData.category
                                        &&
                                        <p className=" ml-auto text-xs">({newPostData.category})</p>
                                    }

                                </div>

                                <div className=" text-sm  max-h-40 overflow-y-scroll"
                                >
                                    {
                                        newPostData.content
                                    }
                                </div>

                                {
                                    (newPostData?.image || postImageUrl)
                                    &&
                                    <ImageReact
                                        style={{ objectFit: "cover" }}
                                        className=' rounded my-2 w-full'
                                        src={postImageUrl}
                                    />
                                }


                                <div
                                    className=' mt-1'
                                    style={{ lineBreak: "anywhere" }}
                                >

                                    {
                                        newPostData.url
                                        &&
                                        <p className=' text-sm' > URl : {newPostData.url}</p>
                                    }


                                    {
                                        newPostData.origin
                                        &&
                                        <p className=' text-sm text-end'>By : {newPostData.origin}</p>
                                    }

                                </div>


                                <div className=" flex flex-wrap gap-2 text-violet-500 font-semibold ">
                                    {

                                        newPostData.hashs.length > 0
                                        &&
                                        newPostData.hashs.map((hash, i) => {
                                            return <p key={i}>{hash}</p>
                                        })

                                    }
                                </div>

                            </div>



                            {/* Not using now ----> */}
                            {/* <SinglePostCard
                                ele={
                                    {

                                        _id: "",
                                        title: newPostData.title,
                                        category: newPostData.category,
                                        promptReturn: newPostData.content,
                                        urlOfPrompt: newPostData.url,
                                        aiToolName: newPostData.origin,
                                        hashthats: newPostData.hashs,
                                        author: {
                                            username: (session?.user.name || "Name"),
                                            email: (session?.user.email || "Email"),
                                            profilePic: (session?.user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwV9k8Uxfa2bIUN1C5bybUsLeU2Ik2YDkAZlp3QYoedLj3QyJfkGs6r51MCrtpCEAlR2Y&usqp=CAU"),
                                            isVerified: false,
                                            isAdmin: false

                                        },
                                        likes: 0,
                                        // likesId: UserDataInterface[]|string[],
                                        likesId: [],
                                        comments: [],
                                        isDeleted: false
                                    }
                                }
                            /> */}



                        </div>

                        {/* Customization and create or update btn here ------> */}
                        <div className=' flex flex-col '>


                            <div className=' px-2'>

                                <div
                                    className=' flex gap-1.5 flex-wrap'
                                >

                                    <p>Customize your Post ☝️:- </p>


                                    <div
                                        className={` flex items-center border rounded pl-1 overflow-hidden ${!themeMode ? "bg-black" : "bg-white"} `}
                                    >
                                        <label
                                            className=' mx-0.5 mr-1.5 font-semibold '
                                            htmlFor="color"
                                        >By Color : </label>
                                        <input
                                            type="color"
                                            className={`${!themeMode ? "bg-black" : "bg-white"}`}
                                            name="color"
                                            id="color"
                                            onChange={(e) => setCutomize({ ...customize, color: e.target.value })}
                                            value={customize.color}
                                        />
                                    </div>

                                    <div
                                        className={` flex items-center border rounded pl-1 overflow-hidden ${!themeMode ? "bg-black" : "bg-white"} `}
                                    >
                                        <label
                                            className=' mx-0.5 mr-1.5 font-semibold '
                                            htmlFor="font"
                                        >By Fonts : </label>

                                        <select
                                            className={`${!themeMode ? "bg-black" : "bg-white"}`}
                                            name="font"
                                            id="font"
                                            onChange={(e) => { setCutomize({ ...customize, font: e.target.value }) }}
                                        >
                                            {
                                                fontFamily.map((ele, i) => {
                                                    return <option key={i} value={ele} >{ele}</option>
                                                })
                                            }

                                            <option value="none" >None</option>
                                        </select>
                                    </div>

                                    <div
                                        className={` flex items-center border rounded pl-1 overflow-hidden ${!themeMode ? "bg-black" : "bg-white"} `}
                                    >
                                        <label
                                            className=' mx-0.5 mr-1.5 font-semibold'
                                            htmlFor="bgColor"
                                        >By Background Color : </label>

                                        <input
                                            type="color"
                                            name="bgColor"
                                            id="bgColor"
                                            className={`${!themeMode ? "bg-black" : "bg-white"}`}
                                            onChange={(e) => setCutomize({ ...customize, bgColor: e.target.value })
                                            }

                                            value={customize.bgColor}
                                        />
                                    </div>

                                    <div
                                        className={` flex items-center border rounded pl-1 overflow-hidden ${!themeMode ? "bg-black" : "bg-white"} `}
                                    >
                                        <label
                                            className=' mx-0.5 mr-1.5 font-semibold '
                                            htmlFor="bgImage"
                                        >By Bg Images : </label>

                                        <select
                                            className={`${!themeMode ? "bg-black" : "bg-white"}`}
                                            name="bgImage"
                                            id="bgImage"
                                            onChange={(e) => {
                                                setCutomize({ ...customize, bgImage: e.target.value });
                                                // console.log(e.target.value)
                                            }}
                                        >
                                            {
                                                bgImage.map((ele, i) => {
                                                    return <option key={i} value={ele} >Image {i + 1}</option>
                                                })
                                            }

                                            <option value="none" >None</option>
                                        </select>
                                    </div>


                                    <button
                                        onClick={() => setCutomize(initailCustomize)}
                                        className=' px-2 border rounded text-xs border-red-500 text-red-500 ml-auto mr-2'
                                    >Default</button>

                                </div>

                                <p className=' text-xs mt-1'>* Make sure your post should look Awesome and visiable properly.</p>
                                <p className=' text-xs'>* Make your post design as better as you can and inhance look and feel.</p>
                            </div>


                            <div className=' flex justify-end'>

                                <button
                                    className={`px-8 mx-8 my-1 rounded-full font-bold bg-green-400 hover:bg-green-600 transition-all ${themeMode ? "text-green-900" : "text-green-900"}`}
                                    onClick={(e) => { submitFormData(e) }}
                                >
                                    {
                                        !updatingPost ? "Create" : "Update"
                                    }
                                </button>
                            </div>

                        </div>

                    </div>

                </div >


            </div >

        </>
    )
}

export default NewPostPage

