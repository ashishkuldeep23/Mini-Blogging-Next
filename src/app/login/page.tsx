"use client";

// import type { Metadata } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/redux/store';
import { logInUser, useUserState } from "@/redux/slices/UserSlice";
import MainLoader from "../components/MainLoader";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import HomeButton from "../components/HomeButton";
import LogInWithGoogle from "../components/LogInWithGoogle";
import { signIn, getProviders } from "next-auth/react";

// export const metadata: Metadata = {
//     title: "LogIn - Auth Next",
// };

const LoginPage = () => {
  // const dispatch = useDispatch<AppDispatch>()

  const themeMode = useThemeData().mode;

  const [passType, setPassType] = useState(false);

  const isFullfilled = useUserState().isFullfilled;

  const router = useRouter();

  const userBackeData = useUserState().userData;

  const isLoading = useUserState().isLoading;

  const errMsg = useUserState().errMsg;

  const [userData, setUserData] = useState({
    email: userBackeData?.email || "",
    password: "",
  });

  const [provider, setProvider] = useState<any>(null);

  function onSubmiHander(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // console.log(e.target)
    // let formData = new FormData(e.target)
    // let formObj = Object.fromEntries(formData.entries())

    // console.log(userData)

    if (!userData.email || !userData.password) {
      // setErrMsg("Maindatory field is not given.")
      return;
    }

    // console.log(provider)

    signIn(provider.credentials.id, {
      callbackUrl: "/",
      email: userData.email,
      password: userData.password,
    });

    // dispatch(logInUser(userData))
  }

  useEffect(() => {
    const setProviders = async () => {
      const res = await getProviders();

      // console.log(res)

      setProvider(res);
    };

    setProviders();
  }, []);

  // useEffect(() => {
  //     if (isFullfilled) {

  //         router.push("/")
  //     }
  // }, [isFullfilled])

  return (
    <>
      <MainLoader isLoading={isLoading} />

      <div
        className={`w-full h-screen flex flex-col items-center py-[20vh]  ${
          !themeMode ? " bg-black text-white " : " bg-white text-black"
        }`}
      >
        <HomeButton />

        <LogInWithGoogle />

        <div className=" border px-4 py-4 rounded-md md:w-1/4">
          <p className=" text-4xl font-bold  text-center px-5 py-1 ">LogIn</p>
          {errMsg && (
            <p className=" text-red-500 font-semibold text-sm text-center">
              Error:{errMsg}
            </p>
          )}

          <form onSubmit={(e) => onSubmiHander(e)}>
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
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className={`block w-full rounded-md border-0 py-1.5  font-semibold px-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    !themeMode
                      ? " bg-black text-white "
                      : " bg-white text-black"
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
                    setUserData({ ...userData, password: e.target.value });
                    setPassType(false);
                  }}
                  id="password"
                  name="password"
                  // type="password"
                  type={!passType ? "password" : "text"}
                  placeholder="Password"
                  className={`block w-full rounded-md border-0 py-1.5  font-semibold px-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    !themeMode
                      ? " bg-black text-white "
                      : " bg-white text-black"
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
              <button
                type="submit"
                className=" px-4 py-2 border bg-green-400 text-white mt-3 rounded-md font-bold ml-auto mr-10"
              >
                LogIn
              </button>
            </div>
          </form>
        </div>
        <div className=" md:w-1/4 mt-2 flex  justify-end text-sm">
          <Link href={"/signup"}>Create a account!</Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
