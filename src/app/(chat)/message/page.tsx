'use client'
import React from 'react'
import { MessageInterface, FriendInterface } from '@/interfaces'
import MessageDisplay from '@/app/components/MessageDisplay';
import { useThemeData } from '@/redux/slices/ThemeSlice';




const dummyMessages: MessageInterface[] = [
  { id: 1, text: 'Hello!', timestamp: Date.now(), senderId: 1 },
  { id: 2, text: 'How are you?', timestamp: Date.now(), senderId: 2 },
  { id: 3, text: 'How are you?', timestamp: Date.now(), senderId: 2 },
  { id: 4, text: 'How are you?', timestamp: Date.now(), senderId: 2 },
  { id: 5, text: 'How are you?', timestamp: Date.now(), senderId: 2 },
  { id: 6 , text: 'How are you?', timestamp: Date.now(), senderId: 2 },
  // Add more dummy messages as needed
];

const dummyFriends: FriendInterface[] = [
  { id: 1, name: 'Alice', online: true },
  { id: 2, name: 'Bob', online: false },
  // Add more dummy friends as needed
];

const Home: React.FC = () => {


  const themeMode = useThemeData().mode

  return (
    <div className="p-4">
      <h1 className={`text-2xl font-bold mb-4 ${!themeMode ? "text-white" : "text-black"}`}>Chat Application</h1>
      <MessageDisplay messages={dummyMessages} friends={dummyFriends} />
    </div>
  );
};

export default Home;
