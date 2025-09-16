import ReactMarkdown from 'react-markdown';
import React from 'react';
function Message({ sender, text }) {
    const isUser = sender === 'user';
    
    return (
        <div className={`flex my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl text-gray-800 dark:text-gray-200 ${isUser ? 'bg-indigo-100 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <ReactMarkdown className="prose prose-sm dark:prose-invert prose-p:my-1">
                    {text}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default Message;