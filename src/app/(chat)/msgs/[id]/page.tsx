// components/Chat.js

'use client'

import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { decryptMessage, encryptMessage } from "@/lib/Crypto-JS";
import { pusherClient } from "@/lib/pusher";


const Chat = ({ params }: any) => {
    const [messages, setMessages] = useState(['U2FsdGVkX1/HANV05x+KDcLe343IHQ/V4/RK0lhvOXE=', 'U2FsdGVkX1/LNWEBBcxtBq1RFl2oQR1Fc8suFBNZ7z0=', 'U2FsdGVkX19Ua4tfDXLCx4RdfRodIQLozIlDOgWjsBY=', 'ok4', 'ok5']);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {


        console.log(params.id)


        // const pusher = new Pusher(process.env.PUSHER_KEY, {
        //     cluster: process.env.PUSHER_CLUSTER,
        // });

        const channel = pusherClient.subscribe("p-chat");

        channel.bind("new-message", (data: any) => {
            // setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        // Fetch user data and messages on mount
    }, []);

    const handleSendMessage = async () => {
        // Encrypt message using Crypto-JS
        // const encryptedMessage = CryptoJS.AES.encrypt(
        //     newMessage,
        //     process.env.ENCRYPTION_KEY
        // ).toString();
        // const encryptedMessage = encryptMessage(newMessage);
        const encryptedMessage = encryptMessage(newMessage);

        // Send message to Pusher
        await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: encryptedMessage,
                // recipientId: (link unavailable),
            }),
        });

        setNewMessage("");
    };

    return (
        <div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {/* Decrypt message using Crypto-JS */}
                        {/* <span>
                            {CryptoJS.AES.decrypt(
                                message,
                                process.env.ENCRYPTION_KEY
                            ).toString(CryptoJS.enc.Utf8)}
                        </span> */}
                        <span>
                            {decryptMessage(message) || message}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Chat;