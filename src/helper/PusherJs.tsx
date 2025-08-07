'use client'

import Pusher from 'pusher-js'
// import { pusherClient } from "@/lib/pusher";
import { useUserState } from "@/redux/slices/UserSlice";
// import NavBottomMobile from "./components/NavBottomMobile";
// import MainLoader from "./components/MainLoader";
// import Modal from "./components/ModalComponent";
import { useEffect, useState } from 'react';
import { useThemeData } from '@/redux/slices/ThemeSlice';
import { pusherClient } from '@/lib/pusherClient';

const username = "ashish"
const recipient = "kuldeep"

export default function PusherTestDiv({ channelName }: { channelName: string }) {


    const themeMode = useThemeData().mode


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

        // // // Subscribe to the channel
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
    // // // This pusher is used to listen the own msg. ------------->>
    const { userData } = useUserState()
    // // // // Sign in by userId ---------->
    useEffect(() => {
        if (userData._id) {

            let userChannel = pusherClient.subscribe(`${userData._id}`)

            userChannel.bind('msg-me', (data: any) => {
                console.log("U sended msg to your self.")
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
        // console.log('Message sent result:', result); // Log result of sending message

    };

    const [msg, setMsg] = useState<string>("")

    const callPusherFn = () => {
        const sendThisText = msg || "My Msg.....";
        sendMessage(sendThisText, channelName, "message");
        setMsg("");
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
            className={`border-2 border-red-500 flex flex-col items-center justify-center w-full rounded-lg  
                 ${!themeMode ? "  text-white bg-black " : "  text-black bg-white"}
            `}
        >
            <p className=" text-center">
                {
                    JSON.stringify(messages)
                }
            </p>
            <p>Checking Pusher here </p>

            <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder='Write your message.'
                className={`m-1 px-2 rounded-md border border-white  ${!themeMode ? "  text-white bg-black " : "  text-black bg-white"} `}
                id=""
            />

            <button
                onClick={() => callPusherFn()}
                className=" m-1 px-2 rounded-md border border-white active:scale-75 transition-all duration-300"
            >Send to others</button>
            <button
                onClick={() => callPusherFnForMsgMe()}
                className=" m-1 px-2 rounded-md border border-white active:scale-75 transition-all duration-300"
            >MSG to Self</button>
        </div>
    )
}
