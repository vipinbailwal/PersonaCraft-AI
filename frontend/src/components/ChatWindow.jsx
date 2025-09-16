import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import Message from './Message';
import { Loader2 } from 'lucide-react';

function ChatWindow({ messages, isLoading }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const LoadingSkeleton = () => (
        <div className="flex my-2 justify-start">
             <div className="max-w-xs p-4 space-y-3 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse">
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800">
            {messages.map((msg, index) => (
                <Message key={index} sender={msg.sender} text={msg.text} />
            ))}
            {isLoading && (
                 <div className="flex items-center justify-start my-2">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16}/>
                        <span>Typing...</span>
                    </div>
                </div>
            )}
            {!isLoading && messages.length === 0 && <div className="flex items-center justify-center h-full text-gray-400">No messages yet. Start the conversation!</div> }
            {isLoading && messages.length === 0 && <LoadingSkeleton />}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatWindow;