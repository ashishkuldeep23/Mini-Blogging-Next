'use client'

import { useThemeData } from "@/redux/slices/ThemeSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllPosts, setSearchBrandAndCate, usePostData } from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import MaskerText from "./components/MaskerText";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";


export default function Home() {

  const router = useRouter()

  const themeMode = useThemeData().mode
  const allPostData = usePostData().allPost
  const isLoading = usePostData().isLoading


  const dispatch = useDispatch<AppDispatch>()

  function fetchAllPostData() {
    let searchObj = { hash: "", category: "", page: 1 }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))
  }


  useEffect(() => {
    if (allPostData.length <= 1) {

      // // // Before calling all posts we need to set queryObject --------->
      fetchAllPostData()
      // dispatch(getAllPosts())
    }
  }, [])


  return (
    <main className={` relative flex min-h-screen flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>


      {/* Loading animation on landing page. */}
      <MainLoader isLoading={isLoading} className=" !top-[85vh]" />


      {/* Now i'm going to user pusher ------> */}
      {/* Pusher working code -----------> */}
      <PusherTestDiv
        channelName='ashish'
      />


      {/* Main home div that hold allPosts and all */}
      <div className=" flex flex-col justify-center items-center pb-6 ">

        <Navbar />

        <div className=" relative flex items-start  gap-5">

          <div className=" w-[100%]">

            <div className="flex flex-col items-center ">

              <FeatureDetailShowHomeFirstTime />

            </div>

          </div>

        </div>

      </div>


      <div>
        <button
          onClick={() => router.push("/home")}
        >Home</button>
      </div>


      {
        allPostData.length > 0
        &&
        <FooterDiv />
      }

    </main>
  );
}



function FeatureDetailShowHomeFirstTime() {

  const [firstTime, setFirstTime] = useState("")

  const router = useRouter()


  // // // This code was responsiable for show and hide feature section.
  useEffect(() => {

    let chcekAlreadyVisited = localStorage.getItem("alreadyVisited")

    if (chcekAlreadyVisited) {

      chcekAlreadyVisited = JSON.parse(chcekAlreadyVisited)

      if (chcekAlreadyVisited) {

        setFirstTime(chcekAlreadyVisited)
        router.push("/home")
      }
    }

    localStorage.setItem("alreadyVisited", JSON.stringify("yes"))

  }, [])


  return (

    <>

      <div className={`
      px-4 mb-7 sm:px-10 flex flex-col items-center text-center 
      transition-all duration-700 scale-100 !h-auto mt-10
       
        `}>

        <h1 className="text-4xl sm:text-6xl font-bold"
        >
          <MaskerText text={"Discover & Share"} />
        </h1>
        <h1 className="ai_heading text-4xl sm:text-6xl font-bold pb-2"
        >
          <MaskerText text={"AI-Powered Prompts"} />
        </h1>
        {/* <p className="ai_heading font-extrabold"><span>(Mini blogging)</span></p> */}

        <h3
          className=" w-11/12 sm:w-4/6 text-sm sm:text-xl leading-4 sm:leading-6 font-semibold"
        >

          <MaskerText text={"PromptiPedia is an open-surce AI prompting tool form mordern world to discover, create and share creative prompts"} />

          {/* <MaskerText text={""} /> */}

        </h3>

      </div>

      <div
        className={` flex flex-col items-center mb-2 ${firstTime ? " scale-100 !h-auto " : " scale-0 !h-0 "} transition-all duration-700 `}
      >

        <p className=" text-2xl font-semibold text-center ">
          Latest posts are 👇
        </p>
        <button
          className="  text-xs px-4 border rounded-2xl"
          onClick={() => {
            // console.log("Clicked ------------>")
            // console.log(firstTime)
            setFirstTime("")
          }}

        >Show web discription</button>


      </div>

    </>

  )

}


const FooterDiv = () => {

  const { isLoading, searchHashAndCate, allPost: allPostData, allPostsLength } = usePostData()

  const dispatch = useDispatch<AppDispatch>()


  const footerDivRef = useRef<HTMLDivElement>(null)


  // function fetchAllPostData() {
  //   let searchObj = { hash: "", category: "", page: searchHashAndCate.page + 1 }
  //   dispatch(setSearchBrandAndCate(searchObj))
  //   dispatch(getAllPosts(searchObj))
  // }


  // const handleScroll = () => {
  //   const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
  //   if (bottom && !isLoading) {

  //     // console.log({ bottom })
  //     // console.log("now call here to get more data from backend ------>")
  //     // setPage(prevPage => prevPage + 1);

  //     // console.log(searchHashAndCate)
  //     // console.log(searchHashAndCate.page + 1)

  //     // // // Here fetching data according to page number ---------> 
  //     // let searchObj = { hash: "", category: "", page: searchHashAndCate.page + 1 }
  //     // dispatch(setSearchBrandAndCate(searchObj))
  //     // dispatch(getAllPosts(searchObj))

  //     fetchAllPostData()

  //   }
  // };



  // useEffect(() => {
  //   // console.log(searchHashAndCate)
  //   const debouncedScrollHandler = debounce(handleScroll, 500);
  //   window.addEventListener('scroll', debouncedScrollHandler);
  //   return () => window.removeEventListener('scroll', debouncedScrollHandler);
  // }, [searchHashAndCate]);




  return (
    <>

      {/* {
        (isLoading && searchHashAndCate.page > 1)
        &&
        (allPostData.length < allPostsLength)
        &&
        <div className=" mt-10 flex gap-2 items-center">
          <span>LOADING</span>
          <span className=" w-4 h-4   rounded-full animate-spin "></span>
        </div>

      } */}

      <div
        className=" mb-7 mt-2"
        ref={footerDivRef}
      >
        <MaskerText className="font-bold text-3xl" text="I'm Footer dude" />
      </div>
    </>
  )
}


import Pusher from 'pusher-js'
import { pusherClient } from "@/lib/pusher";
import { useUserState } from "@/redux/slices/UserSlice";
import NavBottomMobile from "./components/NavBottomMobile";
import MainLoader from "./components/MainLoader";

const username = "ashish"
const recipient = "kuldeep"

function PusherTestDiv({ channelName }: { channelName: string }) {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>(["see"]);
  const [replies, setReplies] = useState<any[]>([]);
  const [room, setRoom] = useState('general');

  // // // In pesonal messaging will get userId from params --------->


  // const channelName = `private-chat-${username}-${recipient}`;
  // const channelName = `chat`;


  // channelName = `private-chat-${channelName}`

  channelName = `p-chat`


  useEffect(() => {

    if (!channelName) {
      console.log("Give channel name please.")
      return
    }


    Pusher.logToConsole = true; // Enable logging

    // const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    //   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    //   authEndpoint: '/api/pusher/auth', // Correct auth endpoint
    // });


    const channel = pusherClient.subscribe(`${channelName}`);

    channel.bind('message', (data: any) => {
      console.log('Received message:', data); // Log received data
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    channel.bind('reply', (data: any) => {
      setReplies((prevReplies) => [...prevReplies, data]);
    });



    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Subscription succeeded'); // Log subscription success
    });

    channel.bind('pusher:subscription_error', (status: any) => {
      console.error('Subscription error:', status); // Log subscription error
    });

    return () => {
      pusherClient.unsubscribe(`${channelName}`);
    };
  }, [room]);



  // // // Sending msg to me ---->
  const { userData } = useUserState()
  // // // // Sign in by userId ---------->
  useEffect(() => {
    if (userData._id) {

      let userChannel = pusherClient.subscribe(`${userData._id}`)

      userChannel.bind('msg-me', (data: any) => {
        console.log({ data })
        alert(`Msg me clicked, ${JSON.stringify(data)}`)
      })

    }

    return () => {
      pusherClient.unsubscribe(`${userData._id}`)
    }
  }, [userData])


  const sendMessage = async (msg: string, channelName: string, event: string) => {
    // e.preventDefault();

    let req = await fetch('/api/pusher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: event,
        data: { username: userData.username || 'User', message: msg, room },
        channel: channelName
      }),
    });

    setMessage('');


    const result = await req.json();
    console.log('Message sent result:', result); // Log result of sending message

  };


  const callPusherFn = () => {
    const sendThisText = "My Msg....."
    sendMessage(sendThisText, channelName, "message")
  }


  function callPusherFnForMsgMe() {

    // console.log(userData._id)
    // return

    if (userData?._id) {
      sendMessage("Check msg me", userData._id, "msg-me")
    }
  }


  return (
    <div
      className=" border-2 border-red-500 flex flex-col items-center justify-center w-full"
    >
      <p className=" text-center">
        {
          JSON.stringify(messages)
        }
      </p>
      <p>Checking Pusher here </p>
      <button
        onClick={() => callPusherFn()}
        className=" m-1 px-2 rounded-md border border-white active:scale-75 transition-all duration-300"
      >Click</button>
      <button
        onClick={() => callPusherFnForMsgMe()}
        className=" m-1 px-2 rounded-md border border-white active:scale-75 transition-all duration-300"
      >MSG ME</button>
    </div>
  )
}
