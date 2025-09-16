"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MaskerText from "./MaskerText";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePostData } from "@/redux/slices/PostSlice";
import { toggleModeValue, useThemeData } from "@/redux/slices/ThemeSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { PiMoonStarsDuotone, PiSunDimDuotone } from "react-icons/pi";
import { AiFillMessage, AiTwotoneMessage } from "react-icons/ai";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const isLoading = usePostData().isLoading;
  const themeMode = useThemeData().mode;

  const dispatch = useDispatch<AppDispatch>();

  const { data: session } = useSession();

  // // This code was responsiable for show and hide feature section.
  useEffect(() => {
    let chcekAlreadyVisited = localStorage.getItem("alreadyVisited");

    if (chcekAlreadyVisited) {
      chcekAlreadyVisited = JSON.parse(chcekAlreadyVisited);

      if (chcekAlreadyVisited) {
        router.push("/home");
      }
    }

    localStorage.setItem("alreadyVisited", JSON.stringify("yes"));
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Navbar */}
      <header className=" sticky -top-6 z-50 backdrop-blur-sm flex items-center justify-between px-6 sm:px-10 py-2 sm:py-4   ">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-sky-500 flex flex-col items-center justify-center"
        >
          <span>Apostio</span>
          {/* <span className=" leading-3 text-[0.5rem] text-white ">Social Media</span> */}
        </motion.h1>

        <div className=" flex items-center justify-end flex-wrap gap-2 pt-1 ">
          <button
            onClick={() => dispatch(toggleModeValue())}
            className={`rounded-full text-xl h-6 hover:text-yellow-500 transition-all hover:scale-125`}
          >
            {themeMode ? (
              <span>
                {" "}
                <PiMoonStarsDuotone />{" "}
              </span>
            ) : (
              <span>
                {" "}
                <PiSunDimDuotone />{" "}
              </span>
            )}
          </button>

          <div>
            {!session ? (
              <div className=" flex flex-wrap  justify-end gap-1">
                <Link
                  href={"/signup"}
                  className={` border rounded-full px-4 sm:px-6 py-2  text-sm font-bold ${
                    themeMode
                      ? " bg-black border-black text-white "
                      : " border-white bg-white text-black"
                  }`}
                >
                  SignUp
                </Link>
                <Link
                  href={"/login"}
                  className={`border rounded-full px-4 sm:px-6 py-2 text-sm font-bold ${
                    themeMode ? "border-black " : " border-white "
                  }`}
                >
                  LogIn
                </Link>
              </div>
            ) : (
              // // // If user is Logged In.
              <div className=" flex flex-wrap  items-center justify-end gap-1.5">
                <button
                  onClick={() => router.push("/msgs")}
                  className={`rounded-full -mt-1.5 text-3xl h-6 text-sky-600 transition-all hover:scale-125`}
                >
                  {themeMode ? (
                    <span>
                      <AiTwotoneMessage />
                    </span>
                  ) : (
                    <span>
                      <AiFillMessage />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* <Link
          href={"/login"}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base"
        >
          Join Now
        </Link> */}
      </header>

      {/* Hero Section */}
      <section className=" mb-10 sm:mb-20 flex flex-col items-center justify-center text-center mt-16 sm:mt-20 px-4 sm:px-6">
        {/* <div className=" ai_heading "> */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className=" ai_heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
        >
          <MaskerText text={"Post. Connect. Explore."} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="ai_heading mt-4 sm:mt-6 text-base sm:text-lg max-w-lg sm:max-w-2xl text-gray-400"
        >
          <MaskerText
            text={
              "Apostio is a modern social platform where you can share your voice, connect with people, and explore a whole new world of ideas and stories."
            }
          />
        </motion.div>
        {/* </div> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={"/home"}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg"
          >
            Get Started
          </Link>
          <Link
            href={"/home"}
            className="bg-transparent border border-sky-600 text-sky-400 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg hover:bg-sky-900"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {isLoading && (
        <div
          className="  my-5 w-full max-w-56 sm:max-w-xl mx-auto"
          aria-hidden="true"
        >
          {/* track */}
          <div
            className="relative overflow-hidden rounded-full"
            style={{ height: 2 }}
          >
            {/* background track */}
            <div
              className="absolute inset-0 bg-zinc-800"
              style={{ opacity: 0.7 }}
            />

            {/* moving fill (animates width from 0% -> 100% repeatedly) */}
            <motion.span
              className="absolute left-0 top-0 bottom-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(99,102,241,1), rgba(79,70,229,0.9))",
                // begin with tiny width; framer-motion will animate it
                width: "0%",
              }}
              animate={{ width: ["0%", "100%"], translateX: ["0%", "70%"] }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
            />
          </div>
        </div>
      )}

      {/* Features Section */}
      <section id="features" className=" px-6 sm:px-10 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          Why Apostio?
        </h3>
        <p className="mt-3 sm:mt-4 text-gray-400 max-w-lg sm:max-w-2xl mx-auto text-sm sm:text-base">
          Designed for people and communities who want to discover, share, and
          grow, Apostio is a fresh and modern space where everyone comes
          together to explore a new world of social discovery.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
          {[
            {
              title: "Post Freely",
              desc: "Express your thoughts, share stories, and publish content with ease.",
            },
            {
              title: "Connect Globally",
              desc: "Build connections, start conversations, and grow your network.",
            },
            {
              title: "Explore More",
              desc: "Discover communities, trending posts, and fresh perspectives.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-sky-600/40 transition"
            >
              <h4 className="text-lg sm:text-xl font-semibold text-sky-400">
                {item.title}
              </h4>
              <p className="mt-3 sm:mt-4 text-gray-400 text-sm sm:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 sm:mt-32 py-6 sm:py-10 bg-zinc-950 text-center text-gray-500 text-sm sm:text-base">
        <p>© {new Date().getFullYear()} Apostio. All rights reserved.</p>
        <p>Developed by Ashish Kuldeep</p>
        <p>Developing now</p>
      </footer>
    </div>
  );
}
