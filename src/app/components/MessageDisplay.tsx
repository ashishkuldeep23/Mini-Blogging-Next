'use client'
import React from 'react';
import { MessageInterface, FriendInterface } from '../../types/Types';
import { useThemeData } from '@/redux/slices/ThemeSlice';

interface Props {
    messages: MessageInterface[];
    friends: FriendInterface[];
}

const MessageDisplay: React.FC<Props> = ({ messages, friends }) => {

    const themeMode = useThemeData().mode

    return (
        <div className="flex flex-col space-y-4">
            <div className="overflow-y-auto min-h-28 max-h-[80vh]">
                {messages.map((message) => (
                    <div key={message.id} className={` mb-2 p-2 rounded-lg ${!themeMode ? "bg-gray-900 text-white" : "text-black bg-gray-100"}`}>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            <div className={`text-sm text-gray-500 ${!themeMode ? "text-white" : "text-black"}`}>
                {friends.filter((friend) => friend.online).length} friends online
            </div>
        </div>
    );
};

export default MessageDisplay;
