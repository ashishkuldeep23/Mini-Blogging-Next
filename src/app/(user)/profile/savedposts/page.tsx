"use client";
import MainLoader from "@/app/components/MainLoader";
import useEditAndDelPostFns from "@/Hooks/useEditAndDelPostFns";
import Link from "next/link";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import { getSavedPostData, useUserState } from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Page: React.FC = () => {
  const themeMode = useThemeData().mode;
  const { userData, isLoading, errMsg } = useUserState();
  const { data: session } = useSession();
  // const charactersWant = 20;
  const dispatch = useDispatch<AppDispatch>();
  const { savePostDeleteHandler } = useEditAndDelPostFns(null);

  const removeSavedPostHandler = (postId: string) => {
    savePostDeleteHandler(postId);
  };

  useEffect(() => {
    // if (userData?.savedPost && Object.keys(userData.savedPost).length <= 0) {
    //   dispatch(getSavedPostData());
    // }
  }, [session]);

  return (
    <div
      className={` relative w-full min-h-screen flex flex-col items-center overflow-hidden ${
        !themeMode ? " bg-black text-white " : " bg-white text-black"
      } `}
    >
      <MainLoader isLoading={isLoading} />

      {errMsg && (
        <p className=" my-5 border border-[#f92f60] rounded-lg px-4 py-2 text-xl">
          <span className=" mr-2 border border-[#f92f60] rounded-full size-4 p-0.5">
            ❌
          </span>
          <span className=" border-b">{errMsg}</span>
        </p>
      )}

      <h2 className=" text-xl my-2 font-bold ">Your Saved Posts</h2>

      {userData &&
        userData?.savedPost &&
        Object.keys(userData?.savedPost).length > 0 && (
          <div className=" w-full flex flex-wrap gap-2 justify-center items-center flex-col my-4 ">
            {Object.keys(userData?.savedPost).map((key, i) => {
              return (
                userData?.savedPost &&
                userData?.savedPost[key].length > 0 && (
                  <div
                    key={i}
                    className=" w-full px-5 py-1 rounded-md text-lg  capitalize font-bold bg-slate-700 text-white "
                  >
                    <div>
                      <p className=" text-center lg:text-start text-2xl ">
                        {key}
                      </p>
                    </div>

                    <div className=" flex gap-2 items-center flex-wrap justify-center lg:justify-start">
                      {userData?.savedPost &&
                        userData?.savedPost[key].length > 0 &&
                        userData?.savedPost[key].map((post, i) => {
                          return (
                            <Link
                              href={`/post/${post._id}`}
                              key={i}
                              className="active:scale-75 transition-all"
                            >
                              <div
                                key={i}
                                className=" h-[17vh] w-[23vh] flex flex-col items-center justify-between px-4 py-2 rounded-lg my-2 bg-gray-900"
                              >
                                <p className=" font-light text-sm text-center">
                                  {post.title ||
                                  (post.promptReturn &&
                                    post.promptReturn.toString().length > 20)
                                    ? `${post.promptReturn.slice(0, 20)}...`
                                    : `${post.promptReturn}`}
                                </p>

                                <div className=" flex gap-1 justify-center items-center w-full">
                                  <button className=" rounded bg-green-700 px-2 py-0.5 text-sm ">
                                    See Post
                                  </button>
                                  <button
                                    className=" rounded border border-red-700 px-1 py-0.5 text-xs  "
                                    onClick={() =>
                                      removeSavedPostHandler(post._id)
                                    }
                                  >
                                    ❌
                                  </button>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                )
              );
            })}
          </div>
        )}
    </div>
  );
};

export default Page;
