"use client";

import ChatDemoUI from "@/app/components/Chat_Componets/ChatComponent";

// import React, { useState, useEffect } from "react";
// import Pusher from "pusher-js";
// import { decryptMessage, encryptMessage } from "@/lib/Crypto-JS";
// import { pusherClient } from "@/lib/pusherClient";
// // import { pusherClient } from "@/lib/pusher";

// const Chat = ({ params }: any) => {
//   const [messages, setMessages] = useState([
//     "U2FsdGVkX1/HANV05x+KDcLe343IHQ/V4/RK0lhvOXE=",
//     "U2FsdGVkX1/LNWEBBcxtBq1RFl2oQR1Fc8suFBNZ7z0=",
//     "U2FsdGVkX19Ua4tfDXLCx4RdfRodIQLozIlDOgWjsBY=",
//   ]);
//   const [newMessage, setNewMessage] = useState("");
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     console.log(params.id);

//     const channel = pusherClient.subscribe("p-chat");

//     channel.bind("new-message", (data: any) => {
//       // setMessages((prevMessages) => [...prevMessages, data.message]);
//     });

//     // Fetch user data and messages on mount
//   }, []);

//   const handleSendMessage = async () => {
//     // Encrypt message using Crypto-JS
//     // const encryptedMessage = encryptMessage(newMessage);
//     const encryptedMessage = encryptMessage(newMessage);

//     // Send message to Pusher
//     await fetch("/api/send-message", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: encryptedMessage,
//         // recipientId: (link unavailable),
//       }),
//     });

//     setNewMessage("");
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//       />
//       <button onClick={handleSendMessage}>Send</button>
//       <ul>
//         {messages.map((message, index) => (
//           <li key={index}>
//             <span>
//               {decryptMessage(message) || `Encrypted message : ${message}`}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Chat;

const ChatUI = () => {
  return <ChatDemoUI />;
};

export default ChatUI;
