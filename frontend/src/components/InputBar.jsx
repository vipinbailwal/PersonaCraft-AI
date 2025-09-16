import React, { useState } from 'react';
import { Send } from 'lucide-react';

function InputBar({ onSendMessage, isLoading }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center gap-2 rounded-b-r-2xl">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                placeholder="Send a message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
                rows="1"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-lg disabled:bg-indigo-400 transition-colors"
                disabled={isLoading || !text.trim()}
            >
                <Send size={20} />
            </button>
        </form>
    );
}

export default InputBar;