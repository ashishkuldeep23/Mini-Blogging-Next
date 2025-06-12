"use client";

import { useThemeData } from "@/redux/slices/ThemeSlice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  createNewPost,
  setWriteFullFilledVal,
  usePostData,
  updatePost,
  setUpdatingPost,
  setIsLoading,
} from "@/redux/slices/PostSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { uploadFileInCloudinary } from "@/lib/cloudinary";
import ImageReact from "@/app/components/ImageReact";
import MainLoader from "@/app/components/MainLoader";
import Navbar from "@/app/components/Navbar";
import {
  NewPostType,
  PostCustomization,
  ValidInputFiles,
} from "../../../../types/Types";
import VideoPlayer from "@/app/components/VideoPlayer";

const NewPostPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const themeMode = useThemeData().mode;

  const {
    singlePostdata,
    updatingPost,
    writePostFullFilled,
    isLoading,
    errMsg,
  } = usePostData();

  const router = useRouter();

  const { data: session, status } = useSession();

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
      font: "",
    },
    image: "",
    metaDataType: null,
    metaDataUrl: "",
  };

  const [newPostData, setNewPostData] =
    useState<NewPostType>(initialNewPostData);

  const [newHash, setNewHash] = useState<string>("");

  type TypeCatAndHash = {
    categories: string[];
    hashthasts: string[];
  };

  const [catAndHash, setCatAndHash] = useState<TypeCatAndHash>({
    categories: [
      "General",
      "shayari",
      "Motivational",
      "Inspirational",
      "Educational",
      "Entertainment",
    ],
    hashthasts: ["#shayari"],
  });

  const [plusCategory, setPlusCategory] = useState<{
    mode: boolean;
    value: string;
  }>({ mode: false, value: "" });

  const { postCategories, posthashtags } = usePostData();

  // // // Customization added here ------------------>>

  const initailCustomize = {
    bgColor: "",
    color: "",
    bgImage: "",
    font: "",
  };

  const [customize, setCutomize] =
    useState<PostCustomization>(initailCustomize);

  const [bgImage, setBgImages] = useState<Array<string>>([
    'url("https://www.transparenttextures.com/patterns/crisp-paper-ruffles.png")',
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23D18'/%3E%3Cstop offset='1' stop-color='%23330000'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'%3E%3Cstop offset='0' stop-color='%23FA3' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FA3' stop-opacity='0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.4'%3E%3Ccircle fill='url(%23b)' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E")`,
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cg %3E%3Ccircle fill='%23000000' cx='400' cy='400' r='600'/%3E%3Ccircle fill='%23230046' cx='400' cy='400' r='500'/%3E%3Ccircle fill='%232f0052' cx='400' cy='400' r='400'/%3E%3Ccircle fill='%233b075e' cx='400' cy='400' r='300'/%3E%3Ccircle fill='%2348156a' cx='400' cy='400' r='200'/%3E%3Ccircle fill='%23552277' cx='400' cy='400' r='100'/%3E%3C/g%3E%3C/svg%3E")`,
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23000' stroke-width='66.7' stroke-opacity='0.05' %3E%3Ccircle fill='%23ff9d00' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%23fb8d17' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23f47d24' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%23ed6e2d' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23e35f34' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%23d85239' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23cc453e' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%23be3941' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23b02f43' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23a02644' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23901e44' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%23801843' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%236f1341' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%235e0f3d' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%234e0c38' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%233e0933' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%232e062c' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23210024' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E")`,
    ` url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23cc0000' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23aa0000' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23d6002b' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23b10022' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23d9004b' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23b2003d' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23d3006c' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%23ac0057' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23c4008c' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%239e0071' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23aa00aa' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23880088' points='943 900 1210 900 971 687'/%3E%3C/svg%3E")`,
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpolygon fill='%23222222' points='800 100 0 200 0 800 1600 800 1600 200'/%3E%3Cpolygon fill='%23444444' points='800 200 0 400 0 800 1600 800 1600 400'/%3E%3Cpolygon fill='%23666666' points='800 300 0 600 0 800 1600 800 1600 600'/%3E%3Cpolygon fill='%23888888' points='1600 800 800 400 0 800'/%3E%3Cpolygon fill='%23aaaaaa' points='1280 800 800 500 320 800'/%3E%3Cpolygon fill='%23cccccc' points='533.3 800 1066.7 800 800 600'/%3E%3Cpolygon fill='%23EEE' points='684.1 800 914.3 800 800 700'/%3E%3C/g%3E%3C/svg%3E")`,
    'url("https://www.transparenttextures.com/patterns/clean-gray-paper.png")',
    'url("https://www.transparenttextures.com/patterns/brushed-alum.png")',
    'url("https://www.transparenttextures.com/patterns/basketball.png")',
    'url("https://www.transparenttextures.com/patterns/argyle.png")',
    'url("https://www.transparenttextures.com/patterns/arabesque.png")',
    'url("https://www.transparenttextures.com/patterns/batthern.png")',
    'url("https://www.transparenttextures.com/patterns/cartographer.png")',
    'url("https://www.transparenttextures.com/patterns/checkered-pattern.png")',
    'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
    'url("https://www.transparenttextures.com/patterns/dark-mosaic.png")',
    'url("https://www.transparenttextures.com/patterns/diagmonds-light.png")',
    'url("https://www.transparenttextures.com/patterns/diagmonds.png")',
    'url("https://www.transparenttextures.com/patterns/food.png")',
    'url("https://www.transparenttextures.com/patterns/foggy-birds.png")',
  ]);

  const [fontFamily] = useState<Array<string>>([
    "cursive",
    "emoji",
    "fangsong",
    "fantasy",
    "math",
    "monospace",
    "sans-serif",
    "system-ui",
    "serif",
  ]);

  const [postImageUrl, setPostImageUrl] = useState<string>("");

  // console.log(postImageUrl)

  const [imageFile, setImageFile] = useState<File>();

  const [metaDataType, setMetaDataType] = useState<null | ValidInputFiles>(
    null
  );

  // console.log(imageFile)
  function addNewHash({
    e,
    text = newHash,
  }: {
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>;
    text?: string;
  }) {
    e.preventDefault();
    e.stopPropagation();

    if (!text) return;

    if (newPostData.hashs.length >= 5) {
      // console.log("Yes -----------> ")

      toast.error("You can only give 5 hashtags.");

      return;
    }

    // // // Remove hash if already have ---->

    if (text[0] === "#") {
      // console.log("54564545")
      text = text.slice(1);
    }

    let newArr = [...newPostData?.hashs, `#${text.toLowerCase()}`];
    let uniqueArr = new Set(newArr);

    // console.log([...uniqueArr])

    setNewPostData({
      ...newPostData,
      hashs: [...uniqueArr],
    });

    setNewHash("");
  }

  function cutOneHash(index: number) {
    newPostData.hashs.splice(index, 1);
    setNewPostData({
      ...newPostData,
      hashs: newPostData.hashs,
    });
  }

  function selectOnChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "plus") {
      setNewPostData({ ...newPostData, category: "" });
      setPlusCategory({ ...plusCategory, mode: true });
    } else {
      setPlusCategory({ value: "", mode: false });
      setNewPostData({ ...newPostData, category: e.target.value });
    }
  }

  function fileInputOnchangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    // // // Check this letter why not getting below val from env

    if (e.target.files) {
      const file = e?.target?.files[0];

      // // // Here now set file ---------->
      // File size should less then 2 mb.
      let maxFileSize = 16007152;
      if (file.size > maxFileSize) {
        return toast.error("File size should less then 12 mb");
      }

      // // // Set variable here -------->>
      setImageFile(file);
      setPostImageUrl(URL.createObjectURL(file));
      setMetaDataType(file.type as ValidInputFiles);
    }
  }

  async function onSubmitHandler(
    even:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    even.preventDefault();

    // console.log(session)

    try {
      if (status === "unauthenticated") {
        router.push("/");
      }

      if (!newPostData.content) {
        toast.error("Write something for new post!");
        return;
      }

      if (!newPostData.category) {
        setNewPostData({ ...newPostData, category: "General" });
      }

      if (!session?.user?.id) {
        toast.error("Plese Login again.");
        router.push("/login");
      }

      if (session?.user?.id) {
        // // // Do 3 things here --------->
        // 1. check any file is present.
        // 2. Upload file into cloudinary.
        // 3. set file url to newPostData inside image key.

        let imageUrl = "";

        // // // New Upadte  --------->>
        let metaDataUrl: string = "";
        let metaDataType: ValidInputFiles = null;

        // let body = {
        //   ...newPostData
        // }

        if (imageFile) {
          dispatch(setIsLoading(true));

          // // Now here we can uplaod file 2nd step ------>
          // imageUrl = await uploadFileInCloudinary(imageFile)
          // //  now using diff var url
          metaDataUrl = await uploadFileInCloudinary(imageFile);
          metaDataType = imageFile.type as ValidInputFiles;
          // console.log({ imageUrl })

          /// // // now set url of image -------->
          setNewPostData({ ...newPostData, metaDataType, metaDataUrl });
        }

        if (updatingPost && singlePostdata?._id) {
          // alert("now call dispatch for update.")

          dispatch(
            updatePost({
              body: {
                ...newPostData,
                metaDataUrl: newPostData.metaDataUrl || metaDataUrl,
                metaDataType: newPostData.metaDataType || metaDataType,
              },

              userId: session?.user?.id,
              postId: singlePostdata?._id,
            })
          );
        } else {
          dispatch(
            createNewPost({
              body: {
                ...newPostData,
                // category: "General",
                category: newPostData.category || "General",
                metaDataType,
                metaDataUrl,
              },
              userId: session?.user?.id,
            })
          );
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(`${error}`);
    }

    // else {
    //   toast.error("Plese Login again.");
    //   router.push("/login");
    // }
  }

  // // // DO THIS ON REDUX --------->
  // async function updatePost() {
  //     // // // when post is updated ------>
  //     // dispatch(setSinglePostdata(post))
  //     // dispatch(setUpdatingPost(true))
  // }

  // // // Update customization here (For Customization) ------>
  useEffect(() => {
    setNewPostData({ ...newPostData, customize: customize });
  }, [customize]);

  // // // Check user is loged in or not and also set (For user logged in.)
  useEffect(() => {
    // console.log(session?.user?.id)

    if (status === "unauthenticated") {
      toast.error("Plese Login.");
      router.push("/home");
    }

    if (status === "authenticated" && session.user.image) {
      setBgImages([...bgImage, `url('${session.user.image.toString()}')`]);
    }

    // console.log(session?.user.image)
  }, [session, status]);

  // // // Redirect user here (For Redirect user form here.) -------------------------->
  useEffect(() => {
    if (writePostFullFilled) {
      // // // back to normal everything -------->
      setNewPostData(initialNewPostData);

      dispatch(setUpdatingPost(false));
      dispatch(setWriteFullFilledVal(false));
      // router.push("/")

      // router.back()
      // // // some logic here -------->
      // // Checking post got updated or created ---->
      if (errMsg === "Post updated successfully.") {
        router.push(`/post/${singlePostdata?._id}`);
      } else {
        router.push("/home");
      }
    }
  }, [writePostFullFilled]);

  // console.log(catAndHash.hashthasts)
  // console.log(catAndHash.categories)

  // // // (I need to check this again.)
  useEffect(() => {
    // console.log('from new post page ---> ', posthashtags)
    if (postCategories.length > 0) {
      setCatAndHash({ hashthasts: posthashtags, categories: postCategories });
      setNewPostData({ ...newPostData, category: postCategories[0] });
    }
  }, [postCategories, posthashtags]);

  // // // Update post here =============>
  useEffect(() => {
    if (updatingPost && singlePostdata?._id) {
      setNewPostData({
        title: singlePostdata?.title,
        category: singlePostdata?.category,
        content: singlePostdata?.promptReturn,
        url: singlePostdata?.urlOfPrompt,
        origin: singlePostdata?.aiToolName,
        hashs: [...singlePostdata?.hashthats],
        customize: singlePostdata?.customize,
        image: singlePostdata?.image,
        metaDataType: singlePostdata?.metaDataType,
        metaDataUrl: singlePostdata?.metaDataUrl,
      });

      if (singlePostdata.customize) {
        setCutomize(singlePostdata?.customize);
      }

      if (singlePostdata?.image) {
        setPostImageUrl(singlePostdata?.image);
      }

      if (singlePostdata?.metaDataUrl) {
        setPostImageUrl(singlePostdata?.metaDataUrl);
      }

      if (singlePostdata?.metaDataType)
        setMetaDataType(singlePostdata.metaDataType);
    }
  }, [singlePostdata]);

  // // // Some common class name that used in input fields ------->
  const classNamesForInputs = ` w-[100%] border rounded-sm px-1 ${
    !themeMode ? " bg-slate-900 text-white" : " bg-slate-100 text-black"
  }`;

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center ${
        !themeMode ? " bg-black text-white " : " bg-white text-black"
      } 
       ${
         themeMode
           ? ` ${!updatingPost ? "bg-green-100" : "bg-rose-100"}`
           : ` ${!updatingPost ? "bg-green-950" : "bg-rose-950"}`
       } 
      `}
    >
      <MainLoader isLoading={isLoading} className=" !fixed " />

      <div className="flex flex-col items-center w-full ">
        <p className=" my-5 px-4 text-2xl font-semibold">
          Create a new post here👇
        </p>

        <div
          className={`rounded flex flex-col w-11/12 xs:w-[89%]  sm:w-3/4 md:w-2/3 
                    ${
                      themeMode
                        ? ` ${!updatingPost ? "bg-green-100" : "bg-rose-100"}`
                        : ` ${!updatingPost ? "bg-green-950" : "bg-rose-950"}`
                    } `}
        >
          <div className="rounded mt-2 flex p-1 gap-2 flex-col sm:flex-row">
            <div
              className={`rounded p-1 border w-full sm:w-3/5 ${
                !themeMode ? " bg-black" : " bg-white"
              }`}
            >
              <form
                className=" flex flex-col gap-2"
                onSubmit={(e) => {
                  onSubmitHandler(e);
                }}
              >
                <div className=" flex flex-col-reverse my-1">
                  <input
                    className={`${classNamesForInputs} w-full`}
                    placeholder="Give title of post"
                    type={"text"}
                    id="title"
                    value={newPostData?.title}
                    name="title"
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNewPostData((pre) => ({
                        ...pre,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  />

                  <label className=" pl-2 pr-1 font-semibold" htmlFor="title">
                    Title
                  </label>
                </div>

                <div className=" flex flex-col-reverse my-1">
                  <textarea
                    style={{ resize: "none" }}
                    placeholder="Give content of post"
                    className={`${classNamesForInputs}`}
                    id="content"
                    rows={3}
                    value={newPostData?.content}
                    name="content"
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNewPostData((pre) => ({
                        ...pre,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  ></textarea>

                  <label className="pl-2 pr-1  font-semibold" htmlFor="content">
                    Content
                  </label>
                </div>

                {/* // // // // New category look like -------> */}
                <div className=" w-full px-0.5 flex flex-col-reverse my-1 ">
                  {/* <div className=''> */}

                  <select
                    onChange={(e) => {
                      selectOnChangeHandler(e);
                    }}
                    className={`${classNamesForInputs} !px-0 scale-[1.02] `}
                    name=""
                    id="category_product"
                    value={newPostData.category ? newPostData.category : ""}
                  >
                    {catAndHash.categories.length &&
                      catAndHash.categories.map((category, i) => {
                        return (
                          <option
                            // {...register("category", { required: "Category is Required" })}

                            // selected={getValues("category") === category ? true : false}

                            key={i}
                            className="capitalize"
                            value={`${category}`}
                          >
                            {category}
                          </option>
                        );
                      })}

                    {/* Plus option for new category -----> */}

                    <option
                      value="plus"
                      onClick={() => {
                        // setPlusCategory(true)
                      }}
                      // onClick={()=>setPlusCategory(true)}
                      // {...register("category", { required: "Category is Required" })}
                    >
                      +Plus
                    </option>
                  </select>

                  <label
                    htmlFor="category_product"
                    className="pl-2 pr-1  font-semibold"
                  >
                    Category
                  </label>

                  {/* </div> */}

                  {/* Add new category All code ----> */}

                  {plusCategory.mode && (
                    // // Take new category input here --->
                    <div className=" flex flex-col flex-wrap ">
                      {/*value get this input ---> */}

                      <div className=" flex items-center">
                        <input
                          id="category_product"
                          type="text"
                          placeholder="Give new category here"
                          // className={`block rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${!themeMode ? " bg-white text-gray-900 " : "bg-gray-900 text-white"}`}

                          value={plusCategory.value}
                          className={`${classNamesForInputs}`}
                          // value={plusCategoryInput.typing}
                          onChange={(e) => {
                            setPlusCategory({
                              ...plusCategory,
                              value: e.target.value,
                            });
                          }}
                        />

                        <button
                          className="border h-full px-1 rounded m-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // setPlusCategoryInput({ typing: "", added: plusCategoryInput.typing });
                            // setValue("category", `${plusCategoryInput.typing}`)

                            setNewPostData({
                              ...newPostData,
                              category: plusCategory.value.trim(),
                            });
                          }}
                        >
                          +Add
                        </button>
                      </div>

                      <div className=" flex flex-wrap items-center">
                        {
                          // plusCategoryInput.added
                          // &&
                          <p style={{ lineBreak: "anywhere" }} className="mx-2">
                            New Category added:
                            <span className=" capitalize bg-green-400 font-semibold border px-0.5 rounded ">
                              {newPostData.category}
                            </span>
                          </p>
                        }

                        {
                          // !plusCategoryInput.added
                          // &&
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Here going to take an file uplad image ------> */}
                <div className=" flex flex-col-reverse justify-start my-1">
                  <div className=" w-[100%]">
                    <input
                      className={`${classNamesForInputs} hidden`}
                      type="file"
                      name=""
                      accept="image/png, image/png, image/jpeg, video/mp4"
                      id="change_img"
                      onChange={(e) => {
                        fileInputOnchangeHandler(e);
                      }}
                    />

                    {/* <i className={`ri-camera-3-line text-6xl sm:text-8xl`}></i> */}
                    <div className={`${classNamesForInputs} w-full  `}>
                      <label
                        className=" h-10 flex  justify-start items-center pl-1 gap-2 flex-wrap"
                        htmlFor="change_img"
                      >
                        <FaCamera className="text-2xl" />
                        <p className=" text-sm">Choose an image for post.</p>
                      </label>
                    </div>
                  </div>

                  <label
                    className=" pl-2 pr-1  font-semibold"
                    htmlFor="change_img"
                  >
                    *Image/Video
                  </label>
                </div>

                {/** 
                <div className=' flex flex-col-reverse my-1'>c
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
                    className=' pl-2 pr-1 font-semibold'
                    htmlFor="url"
                  >*Url</label>

                </div>
                */}

                {/* <div className=' flex flex-col-reverse my-1'>
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
                    className=' pl-2 pr-1  font-semibold'
                    htmlFor="origin"
                  >*Origin</label>

                </div> */}

                <div>
                  <div
                    className={` ${
                      !themeMode ? "text-violet-300" : "text-violet-700"
                    } flex flex-wrap  items-center gap-1`}
                  >
                    {newPostData.hashs.map((ele, i) => {
                      return (
                        <p
                          key={i}
                          className=" border border-cyan-400 pl-2 rounded-md"
                        >
                          {ele}
                          <span
                            onClick={() => cutOneHash(i)}
                            className="bg-red-500 rounded-full font-semibold px-1 mx-1 text-white hover:cursor-pointer hover:bg-red-700 "
                          >
                            x
                          </span>
                        </p>
                      );
                    })}
                  </div>

                  <div className="my-1 flex flex-col-reverse">
                    <div
                      className={` relative flex justify-end w-[100%] border rounded `}
                      // className={`flex  `}
                    >
                      <div className=" w-[100%] flex items-center">
                        <input
                          className={`${classNamesForInputs} !w-full relative z-10 rounded-e-none `}
                          placeholder="Give HasThats of post"
                          type={"text"}
                          id="HasThats"
                          name="HasThats"
                          value={newHash}
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNewHash(() => e.target.value);
                          }}
                          onKeyDown={(e) => {
                            // e.preventDefault();
                            // console.log(e.key)
                            if (e.key === "Enter") {
                              addNewHash({ e });
                            }
                          }}
                        />

                        <button
                          className=" -ml-1 mb-0.5 scale-y-[1.6] scale-x-125"
                          onClick={(e) => {
                            // e.preventDefault()
                            addNewHash({ e });
                          }}
                        >
                          ⬆️
                        </button>
                      </div>

                      {
                        // // // Suggetion div with logic here ---------->
                        newHash && (
                          <div
                            className={`absolute z-[1] top-[110%] rounded w-full px-0.5 ${
                              !themeMode ? "bg-black" : "bg-white"
                            } `}
                          >
                            {catAndHash.hashthasts
                              .filter((ele) => ele.includes(newHash))

                              .map((ele, i) => {
                                return (
                                  <Fragment key={i}>
                                    {ele && (
                                      <div
                                        className=" border-b"
                                        onClick={() => {
                                          newPostData.hashs.push(ele);

                                          // console.log(newPostData.hashs)

                                          setNewPostData({
                                            ...newPostData,
                                            hashs: newPostData.hashs,
                                          });
                                          setNewHash("");
                                        }}
                                      >
                                        {ele}
                                      </div>
                                    )}
                                  </Fragment>
                                );
                              })}
                          </div>
                        )
                      }
                    </div>

                    <label
                      className=" pl-2 pr-1 font-semibold"
                      htmlFor="HasThats"
                    >
                      *Hasthats
                    </label>
                  </div>
                </div>
              </form>

              <p className=" text-center">star(*) marked are optional.</p>
            </div>

            {/* Post UI of given data shown here -------> */}
            <div
              className={` relative overflow-hidden rounded p-1 border w-full transition-all duration-500 sm:w-2/5 ${
                !themeMode ? " bg-black" : " bg-white"
              }`}
              style={{
                backgroundColor: customize.bgColor,
                color: customize.color,
                backgroundImage: customize.bgImage,
                fontFamily: `${customize.font} , sans-serif`,

                // // // added more style if user choosed profile pic as bg of post ------>
                backgroundRepeat:
                  `url('${session?.user.image}')` === `${customize.bgImage}`
                    ? "no-repeat"
                    : "",
                backgroundPosition:
                  `url('${session?.user.image}')` === `${customize.bgImage}`
                    ? "center"
                    : "",
                backgroundSize:
                  `url('${session?.user.image}')` === `${customize.bgImage}`
                    ? "cover"
                    : "",
              }}
            >
              <div className="rounded-t flex gap-1.5 items-center border-b border-cyan-400">
                <ImageReact
                  className=" rounded-full w-8 h-8 aspect-square object-cover"
                  src={`${
                    session?.user.image ||
                    "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"
                  }`}
                  alt=""
                />
                <p className=" font-semibold capitalize">
                  {session?.user.name || "Name Kumar"}
                </p>
              </div>

              <div className=" flex justify-between flex-wrap gap-1">
                <p className=" capitalize">{newPostData.title}</p>

                {newPostData.category && (
                  <p className=" ml-auto text-xs">({newPostData.category})</p>
                )}
              </div>

              <div className=" text-sm  max-h-40 overflow-y-scroll">
                {newPostData.content}
              </div>

              {(newPostData?.image || postImageUrl) &&
              metaDataType === "video/mp4" ? (
                <VideoPlayer videoUrl={postImageUrl} />
              ) : (
                (metaDataType === "image/jpeg" ||
                  metaDataType === "image/png") && (
                  <ImageReact
                    style={{ objectFit: "cover" }}
                    className=" rounded my-2 w-full"
                    src={postImageUrl}
                  />
                )
              )}

              <div className=" mt-1" style={{ lineBreak: "anywhere" }}>
                {newPostData.url && (
                  <p className=" text-sm"> URl : {newPostData.url}</p>
                )}

                {newPostData.origin && (
                  <p className=" text-sm text-end">By : {newPostData.origin}</p>
                )}
              </div>

              <div className=" flex flex-wrap gap-2 text-violet-500 font-semibold ">
                {newPostData.hashs.length > 0 &&
                  newPostData.hashs.map((hash, i) => {
                    return <p key={i}>{hash}</p>;
                  })}
              </div>
            </div>
          </div>

          {/* Customization and create or update btn here ------> */}
          <div className=" flex flex-col ">
            <div className=" px-2 my-5 border rounded-xl m-1 py-2">
              <p className=" my-2 ">Customize your Post ☝️:- </p>

              <div className=" flex gap-1.5 flex-wrap">
                <div
                  className={` flex items-center flex-col-reverse border rounded pl-1 overflow-hidden ${
                    !themeMode ? "bg-black" : "bg-white"
                  } w-[45%] mx-auto `}
                >
                  <label
                    className=" mx-0.5 mr-1.5 font-semibold "
                    htmlFor="color"
                  >
                    By Color :{" "}
                  </label>
                  <input
                    type="color"
                    className={`${
                      !themeMode ? "bg-black" : "bg-white"
                    } w-[100%]`}
                    name="color"
                    id="color"
                    onChange={(e) =>
                      setCutomize({ ...customize, color: e.target.value })
                    }
                    value={customize.color}
                  />
                </div>

                <div
                  className={` flex items-center flex-col-reverse border rounded pl-1 overflow-hidden ${
                    !themeMode ? "bg-black" : "bg-white"
                  } w-[45%] mx-auto`}
                >
                  <label
                    className=" mx-0.5 mr-1.5 font-semibold "
                    htmlFor="font"
                  >
                    By Fonts :{" "}
                  </label>

                  <select
                    className={`${!themeMode ? "bg-black" : "bg-white"}`}
                    name="font"
                    id="font"
                    onChange={(e) => {
                      setCutomize({ ...customize, font: e.target.value });
                    }}
                  >
                    {fontFamily.map((ele, i) => {
                      return (
                        <option key={i} value={ele}>
                          {ele}
                        </option>
                      );
                    })}

                    <option value="none">None</option>
                  </select>
                </div>

                <div
                  className={` flex items-center flex-col-reverse border rounded pl-1 overflow-hidden ${
                    !themeMode ? "bg-black" : "bg-white"
                  } w-[45%] mx-auto `}
                >
                  <label
                    className=" mx-0.5 mr-1.5 font-semibold"
                    htmlFor="bgColor"
                  >
                    By Bg Color :{" "}
                  </label>

                  <input
                    type="color"
                    name="bgColor"
                    id="bgColor"
                    className={`${
                      !themeMode ? "bg-black" : "bg-white"
                    } w-[100%]`}
                    onChange={(e) =>
                      setCutomize({ ...customize, bgColor: e.target.value })
                    }
                    value={customize.bgColor}
                  />
                </div>

                <div
                  className={` flex items-center flex-col-reverse border rounded pl-1 overflow-hidden ${
                    !themeMode ? "bg-black" : "bg-white"
                  } w-[45%] mx-auto `}
                >
                  <label
                    className=" mx-0.5 mr-1.5 font-semibold "
                    htmlFor="bgImage"
                  >
                    By Bg Images :{" "}
                  </label>

                  <select
                    className={`${!themeMode ? "bg-black" : "bg-white"}`}
                    name="bgImage"
                    id="bgImage"
                    onChange={(e) => {
                      setCutomize({ ...customize, bgImage: e.target.value });
                    }}
                  >
                    {bgImage.map((ele, i) => {
                      return (
                        <option key={i} value={ele}>
                          Image {i + 1}
                        </option>
                      );
                    })}

                    <option value="none">None</option>
                  </select>
                </div>

                <button
                  onClick={() => setCutomize(initailCustomize)}
                  className=" px-2 border rounded text-xs border-red-500 text-red-500 ml-auto mr-2"
                >
                  Default
                </button>
              </div>

              <p className=" text-xs mt-1">
                * Make sure your post should look Awesome and visiable properly.
              </p>
              <p className=" text-xs">
                * Make your post design as better as you can and inhance look
                and feel.
              </p>
            </div>

            <div className=" flex justify-end">
              {!isLoading && (
                <button
                  className={` text-3xl px-10 py-2 mb-4 mx-4 my-1 rounded-full font-bold bg-green-400 active:scale-90 hover:bg-green-600 transition-all ${
                    themeMode ? "text-green-900" : "text-green-900"
                  }`}
                  onClick={(e) => {
                    onSubmitHandler(e);
                  }}
                >
                  {!updatingPost ? "Create" : "Update"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostPage;
