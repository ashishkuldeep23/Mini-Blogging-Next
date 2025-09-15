"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createNewUser, useUserState } from "@/redux/slices/UserSlice";
import MainLoader from "../components/LoaderUi";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import HomeButton from "../components/HomeButton";
import LogInWithGoogle from "../components/LogInWithGoogle";

const SignUpPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const themeMode = useThemeData().mode;

  const router = useRouter();

  const isFullfilled = useUserState().isFullfilled;

  const userBackeData = useUserState().userData;

  const isLoading = useUserState().isLoading;

  const [passType, setPassType] = useState(false);

  type UserInitialData = {
    email: string;
    password: string;
    username: string;
  };

  const userInitialData: UserInitialData = {
    email: userBackeData?.email,
    username: userBackeData?.username,
    password: "",
  };

  const [userData, setUserData] = useState(userInitialData);

  const [errMsgWithStatus, setErrMsgWithStatus] = useState({
    status: false,
    msg: "",
  });

  const setErrMsg = (str: string) => {
    setErrMsgWithStatus({ status: true, msg: `ERROR : ${str}` });
  };

  const hideErrMsg = () =>
    setErrMsgWithStatus({ ...errMsgWithStatus, status: false });

  const onSignup = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: UserInitialData
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // // // Validation ------>

    let { username, email, password } = data;

    if (!username || !email || !password) {
      setErrMsg("Maindatory field is not given.");
      return;
    }
    dispatch(createNewUser(data));

    // console.log(userData)
  };

  useEffect(() => {
    if (isFullfilled) {
      setUserData(userInitialData);

      router.push("/login");
    }
  }, [isFullfilled]);

  return (
    <>
      <MainLoader isLoading={isLoading} />

      <div
        className={`w-full h-screen flex flex-col items-center  py-[20vh] ${
          !themeMode ? " bg-black text-white " : " bg-white text-black"
        }`}
      >
        <HomeButton />

        <LogInWithGoogle />

        {/* remove : hidden */}
        <div
          className={` hidden shadow shadow-white px-4 py-4 rounded-md md:w-1/4`}
        >
          <p className=" text-4xl font-bold  text-center px-5 py-1 ">SingUp</p>

          {errMsgWithStatus.status && (
            <p className=" text-center text-red-600 font-semibold mt-1">
              {errMsgWithStatus.msg}
            </p>
          )}

          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6  mt-3"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                value={userData.username}
                onChange={(e) => {
                  hideErrMsg();
                  setUserData({ ...userData, username: e.target.value });
                }}
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className={`block w-full rounded-md border-0 py-1.5  font-semibold px-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  !themeMode ? " bg-black text-white " : " bg-white text-black"
                }`}
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6  mt-3"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                value={userData.email}
                onChange={(e) => {
                  hideErrMsg();
                  setUserData({ ...userData, email: e.target.value });
                }}
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                className={`block w-full rounded-md border-0 py-1.5  font-semibold px-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  !themeMode ? " bg-black text-white " : " bg-white text-black"
                }`}
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6  mt-3"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                value={userData.password}
                onChange={(e) => {
                  hideErrMsg();
                  setUserData({ ...userData, password: e.target.value });
                  setPassType(false);
                }}
                id="password"
                name="password"
                // type="password"
                type={!passType ? "password" : "text"}
                placeholder="Password"
                className={`block w-full rounded-md border-0 py-1.5  font-semibold px-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  !themeMode ? " bg-black text-white " : " bg-white text-black"
                }`}
              />
              <span
                className=" absolute border  rounded  border-zinc-500 top-1.5 right-2 hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPassType(!passType);
                }}
              >
                👁️‍🗨️
              </span>
            </div>
          </div>

          <div className=" flex">
            <Link
              href={"/login"}
              className=" px-4 py-2  mt-3 rounded-md font-bold ml-auto mr-10"
            >
              LogIn
            </Link>

            <button
              className=" px-4 py-2 border bg-green-400 text-white mt-3 rounded-md font-bold ml-auto mr-10"
              onClick={(e) => onSignup(e, userData)}
            >
              SingUp
            </button>
          </div>

          {/* <div className="  mt-2 flex  justify-end  text-sm ">
            <Link href={"/login"}>Already have account!</Link>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
