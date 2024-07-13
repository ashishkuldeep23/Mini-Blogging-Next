'use client'

import { useThemeData } from "@/redux/slices/ThemeSlice";
import Navbar from "./components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllPosts, usePostData, setSearchBrandAndCate, setSearchByText } from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import MainLoader from "./components/MainLoader";
import MaskerText from "./components/MaskerText";
import { useRouter } from "next/navigation";
import SinglePostCard from "./components/SinglePostCard";
import { useSession } from "next-auth/react";
// import ThreeDCardDemo from "./components/ui/card";

import { BsFillPatchPlusFill } from "react-icons/bs";
// import { debounce } from "@/utils/debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlaceholdersAndVanishInput } from "./components/ui/placeholders-and-vanish-input";
{/* <BsFillPatchPlusFill /> */ }



export default function Home() {

  const { data: session } = useSession()

  const themeMode = useThemeData().mode

  const allPostData = usePostData().allPost

  const router = useRouter()

  // console.log(themeMode)


  // let onFocusFlagForRedirectUser = false

  return (
    <main className={` relative flex min-h-screen flex-col items-center ${!themeMode ? " bg-black text-white " : " bg-white text-black"}`}>

      {/* Socket IO component here ------------> */}
      {/* <SocketConnectionCodeHere /> */}

      {/* Now i'm going to user pusher ------> */}
      {/* Pusher working code -----------> */}
      <PusherTestDiv
        channelName='ashish'
      />

      

      <Navbar />

      {/* Plus ICon to create post  */}
      {
        session?.user._id

        &&

        <button
          className="add_button_down_right fixed bottom-[8%] sm:bottom-[10%] right-5 sm:right-[4%] text-5xl z-[100] fill-neutral-700 hover:scale-125 focus:scale-90 transition-all"
          onClick={() => { router.push("/new-post") }}
        // style={{ backdropFilter : "drop-shadow(2px 4px 6px cyan)"}}
        >
          <BsFillPatchPlusFill />
        </button>



      }


      <div className=" flex flex-col justify-center items-center pb-6 ">


        <div className="flex flex-col items-center ">

          <FeatureDetailShowHomeFirstTime />

        </div>

        <SearchByDiv />


        <AllPostDiv />

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


  useEffect(() => {

    localStorage.setItem("alreadyVisited", JSON.stringify("yes"))


    let chcekAlreadyVisited = localStorage.getItem("alreadyVisited")

    if (chcekAlreadyVisited) {

      chcekAlreadyVisited = JSON.parse(chcekAlreadyVisited)

      chcekAlreadyVisited && setFirstTime(chcekAlreadyVisited)
    }


  }, [])


  return (

    <>

      <div className={`px-4 mb-7 sm:px-10 flex flex-col items-center text-center ${!firstTime ? " scale-100 !h-auto mt-10 " : " scale-0 !h-0 "} transition-all duration-700 `}>

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


const SearchByDiv = () => {

  const [expandCat, setExpandCat] = useState(false)

  const [expandHash, setExpandHash] = useState(false)

  const { postCategories, posthashtags, searchHashAndCate, searchByText } = usePostData()

  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()

  // console.log(themeMode)
  const themeMode = useThemeData().mode

  // // // A var that used in redirect user.
  let onFocusFlagForRedirectUser = false



  function getDataByCategory(cat: string) {
    let searchObj = { ...searchHashAndCate, category: `${cat}` }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))
  }


  function getDataByHashtag(hash: string) {
    let searchObj = { ...searchHashAndCate, hash: `${hash}` }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))
  }


  function backToNormalHandler() {
    let searchObj = { hash: "", category: "", page: 1 }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))

    setExpandCat(false);
    setExpandHash(false);

  }



  return (

    <>

      {/* Previously using this ---------> */}
      {/* <input
        type="text"
        className={`mb-4 p-0.5 px-2 font-bold mt-5 w-11/12 sm:w-4/6 rounded-full shadow-lg  border 
          ${!themeMode ? "text-white bg-black shadow-slate-700 border-slate-700 " : "text-black bg-white shadow-slate-300 border-slate-300 "}
       `}
        placeholder="Search for prompt here."
        name="Search_Input"
        onFocus={() => {
          if (!onFocusFlagForRedirectUser) {
            onFocusFlagForRedirectUser = true
            router.push('/search')
          }
        }}

        onClick={() => router.push('/search')}

      /> */}


      <PlaceholdersAndVanishInput
        onChange={(e) => {
          // e.preventDefault()

          dispatch(setSearchByText(e.target.value))

          if (!onFocusFlagForRedirectUser) {
            onFocusFlagForRedirectUser = true
            router.push('/search')
          }
        }}
        onSubmit={() => {
          // e.preventDefault()
          if (!onFocusFlagForRedirectUser) {
            onFocusFlagForRedirectUser = true
            router.push('/search')
          }
        }}
        onFocus={() => {
          // e.preventDefault()
          if (!onFocusFlagForRedirectUser) {
            onFocusFlagForRedirectUser = true
            router.push('/search')
          }
        }}
        placeholders={['Search by post title, category and hashtag', 'Search by user name.', 'Search here...', 'Made by Ashish kuldeep.']}
        inputValue={searchByText}
      />



      <div className=" w-11/12 sm:w-4/6 flex flex-col items-center px-1 sm:px-5 ">

        <div className="w-full flex justify-around flex-wrap">


          <div>
            <p>Search By 👉</p>
          </div>

          <div className=" filter_container  ">
            <p
              className={`  px-1 hover:cursor-pointer ${expandCat && "text-violet-500 font-bold"} transition-all`}
              onClick={() => {
                setExpandCat(!expandCat);
                // setExpandHash(false); 
              }}
            >Category</p>

          </div>

          <div className=" filter_container  ">
            <p
              className={` px-1 hover:cursor-pointer ${expandHash && "text-violet-500  font-bold"} transition-all`}
              onClick={() => {
                setExpandHash(!expandHash);
                // setExpandCat(false);
              }}
            >#Hashtags</p>

          </div>

        </div>


        <div
          className={` border mt-2 rounded flex gap-2 flex-wrap justify-around px-1 overflow-hidden ${!expandCat ? " border-0 w-1/2 h-0 opacity-100" : " w-full  opacity-100"} transition-all  `}
          style={{ transitionDuration: "1.0s" }}
        >

          {

            postCategories.length > 0
            &&
            postCategories.map((ele, i) => {
              return <p
                key={i}
                className=" font-bold text-violet-500 hover:cursor-pointer "
                onClick={() => { getDataByCategory(ele) }}
              >{ele}</p>
            })
          }

        </div>

        <div
          className={` border mt-2 rounded flex gap-2 flex-wrap justify-around px-1 overflow-hidden ${!expandHash ? " border-0 w-1/2 h-0 opacity-100" : " w-full opacity-100"} transition-all `}
          style={{ transitionDuration: "1.0s" }}
        >
          {

            (posthashtags.length > 0)
            &&
            posthashtags.map((ele, i) => {
              return <p
                key={i}
                className=" font-bold text-violet-500 hover:cursor-pointer "
                onClick={() => { getDataByHashtag(ele) }}
              >{ele}</p>
            })
          }
        </div>


        {
          (expandCat || expandHash)
          &&
          <button
            className=" text-xs border border-red-500 text-red-500 my-2 px-2 rounded ml-auto mr-2"
            onClick={() => {
              setExpandCat(false);
              setExpandHash(false);
            }}
          >Close</button>
        }




        {
          (searchHashAndCate.category || searchHashAndCate.hash)
          &&
          <button
            className=" mt-10  text-xs border rounded-md px-2"
            onClick={() => {
              backToNormalHandler()
            }}
          >Back to Default</button>
        }


      </div>
    </>
  )
}


function AllPostDiv() {

  const { allPost: allPostData, isLoading, searchHashAndCate, allPostsLength } = usePostData()

  const dispatch = useDispatch<AppDispatch>()


  // async function fetchAllPosts() {

  //   dispatch(setIsLoading(true))

  //   dispatch(setErrMsg(""))

  //   const option: RequestInit = {
  //     method: "POST",
  //     cache: 'no-store',
  //     next: {
  //       revalidate: 3
  //     },
  //   }

  //   const response = await fetch(`/api/post/all?timestamp=${Date.now()}`, option)
  //   let json = await response.json();

  //   // console.log(json)

  //   if (json.success) {
  //     dispatch(setAllPosts(json.data))
  //   } else {
  //     dispatch(setErrMsg(json.message))
  //   }

  //   dispatch(setIsLoading(false))
  // }



  function fetchAllPostData() {
    let searchObj = { hash: "", category: "", page: 1 }
    dispatch(setSearchBrandAndCate(searchObj))
    dispatch(getAllPosts(searchObj))

  }


  function fetchMorePostData() {
    let searchObj = { hash: "", category: "", page: searchHashAndCate.page + 1 }
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

    <InfiniteScroll
      dataLength={allPostData.length} //This is important field to render the next data
      next={() => {

        if (allPostData.length < allPostsLength && !searchHashAndCate.category && !searchHashAndCate.hash) {
          fetchMorePostData()
        }
      }}

      hasMore={true}
      loader={
        (allPostData.length < allPostsLength && !searchHashAndCate.category && !searchHashAndCate.hash)
        &&

        <div className=" mt-10 flex gap-2 items-center">
          <span>LOADING...</span>
          <span className=" w-4 h-4   rounded-full animate-spin "></span>
        </div>
      }

      className="w-[98vw] min-h-[50vh] pt-[1vh] pb-[7vh] px-[2vh] !overflow-auto flex flex-col items-center justify-center"
    >

      <div className="card_container mt-10 relative sm:px-[8vh] flex gap-10 gap-x-64 p-0.5 flex-wrap justify-center items-center ">

        <MainLoader
          isLoading={isLoading}
        // className="top-0" 
        />

        {

          allPostData.length > 0
            ?

            allPostData.map((ele, i) => {
              return (
                <SinglePostCard key={i} ele={ele} className=" hover:z-10" />
              )
            })

            : <></>

          // : [null, null, null, null, null, null, null, null, null, null].map((ele, i) => {
          //   return (

          //     <Card key={i} ele={ele} />

          //   )
          // })
        }

      </div>

    </InfiniteScroll>

  )
}

// export default AllPostDiv

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


// import { useEffect, useState } from "react";
// import { socket } from "../socket";
import { useUserState } from "@/redux/slices/UserSlice";

// function SocketConnectionCodeHere() {

//   const [isConnected, setIsConnected] = useState(false);
//   const [transport, setTransport] = useState("N/A");

//   const { userData } = useUserState()

//   // console.log(socket)

//   function onConnect() {
//     setIsConnected(true);
//     setTransport(socket.io.engine.transport.name);

//     socket.io.engine.on("upgrade", (transport: any) => {
//       setTransport(transport.name);
//     });
//   }


//   function onDisconnect() {
//     setIsConnected(false);
//     setTransport("N/A");
//   }


//   // // // This is how we can connent with socket ------>
//   useEffect(() => {
//     if (socket.connected) {
//       onConnect();
//     }

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//     };
//   }, []);


//   // useEffect(() => {
//   //   if (isConnected) {

//   //     socket.emit("connection", "world");
//   //     socket.emit("hello", "world");
//   //   }
//   // }, [isConnected])


//   // // // Register user with socket IO ------------>

//   useEffect(() => {
//     if (userData._id) {
//       socket.emit("register", userData);
//     }
//   }, [userData])


//   // console.log("Render  ------------------>")



//   function newMsg() {

//     console.log("Trying to send new msg ---------> ")

//     socket.emit("hello", "world", (err: any) => {
//       console.log(err)
//     });
//   }




//   // // // All coming listners here ------------->
//   useEffect(() => {

//     // // // PUT all socket listernes inisde useEffect -------------->

//     socket.on("word", (msg: any) => {
//       console.log({ msg })
//       alert(msg)
//     })


//     return () => {
//       socket.off()
//       socket.off("disconnect", onDisconnect);
//     }

//   }, [])


//   return (
//     <div
//       className="border-2 border-red-500 w-dvw text-center hover:cursor-pointer"
//     >
//       <p>Status: {isConnected ? "connected" : "disconnected"}</p>
//       <p>Transport: {transport}</p>

//       <button
//         onClick={newMsg}
//         className="px-2 border rounded-md border-white my-2 mx-3 active:scale-75"
//       >Send Msg</button>
//     </div>
//   );

// }



import Pusher from 'pusher-js'
import { pusherClient } from "@/lib/pusher";


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
