"use client";

import { useRouter } from "next/navigation";

export default function MessagePage() {
  const router = useRouter();

  const generalClickHandler = () => {
    router.push("/general-msgs");
  };

  return (
    <>
      <div
        onClick={generalClickHandler}
        className="  w-full h-16 flex justify-center items-center border-2 text-rose-500 border-rose-500 rounded active:scale-75 transition-all"
      >
        <button className=" ">Go to general Chat BTN here</button>
      </div>

      <div className=" my-1 border-2 border-green-500 text-green-500 h-10 rounded w-full flex justify-center items-center">
        <p>Search Input here</p>
      </div>

      <div className=" my-1 border-2 border-yellow-500 text-yellow-500 h-24 rounded w-full flex justify-center items-center">
        <p>All Online friends here </p>
      </div>

      <div className=" my-5 border-2 border-teal-500 text-yellow-500 min-h-[50vh] rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 ">
        {Array(15)
          .fill(null)
          .map((_, i) => {
            return (
              <div
                key={i}
                className=" my-1 bg-teal-900 text-white h-16 rounded w-full flex  justify-center items-center "
              >
                <p>All msgs here {i + 1}</p>
              </div>
            );
          })}
      </div>
    </>
  );
}
