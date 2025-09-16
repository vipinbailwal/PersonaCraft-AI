import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import CreationWizard from '../components/CreationWizard';
import toast from 'react-hot-toast';

export default function ChatPage() {
    const [personas, setPersonas] = useState([]);
    const [activePersona, setActivePersona] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isWizardOpen, setWizardOpen] = useState(false);

    const fetchPersonas = async () => {
        try {
            const response = await api.get('/personas');
            setPersonas(response.data);
            if (response.data.length > 0 && !activePersona) {
                setActivePersona(response.data[0]);
            }
        } catch (error) {
            toast.error("Failed to fetch personas");
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);
    
    useEffect(() => {
        const fetchHistory = async () => {
            if (activePersona) {
                setMessages([]); // Clear previous messages
                setIsLoading(true);
                try {
                    const response = await api.get(`/chat/${activePersona._id}`);
                    const history = response.data.map(item => ({
                        sender: item.role === 'user' ? 'user' : 'bot',
                        text: item.parts[0].text
                    }));
                    setMessages(history);
                } catch (error) {
                    toast.error("Failed to load chat history.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchHistory();
    }, [activePersona]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() || !activePersona) return;

        const newUserMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ personaId: activePersona._id, message: messageText }),
            });
            
            if (!response.body) return;
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');
                
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = JSON.parse(line.substring(5));
                        if (data.chunk) {
                            setMessages(prev => {
                                if (prev.length === 0) return prev;
                                const lastMessage = prev[prev.length - 1];
                                const updatedLastMessage = { ...lastMessage, text: lastMessage.text + data.chunk };
                                return [...prev.slice(0, -1), updatedLastMessage];
                            });
                        }
                    }
                }
            }
        } catch (error) {
            toast.error('Failed to get response from AI.');
             setMessages(prev => {
                if (prev.length === 0) return prev;
                return prev.slice(0, -1); // Remove bot placeholder
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePersonaCreated = (newPersona) => {
        fetchPersonas();
        setActivePersona(newPersona);
        setWizardOpen(false);
    };
    
    const handleDeletePersona = async (personaId) => {
        if (window.confirm("Are you sure you want to delete this persona?")) {
            try {
                await api.delete(`/personas/${personaId}`);
                toast.success("Persona deleted.");
                if (activePersona?._id === personaId) {
                    setActivePersona(null);
                    setMessages([]);
                }
                fetchPersonas();
            } catch (error) {
                toast.error("Failed to delete persona.");
            }
        }
    };
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center items-center font-sans">
            <div className="w-full max-w-5xl h-[95vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex">
                <Sidebar 
                    personas={personas} 
                    activePersona={activePersona} 
                    setActivePersona={setActivePersona}
                    onNewPersonaClick={() => setWizardOpen(true)}
                    onDeletePersona={handleDeletePersona}
                />
                <main className="flex-1 flex flex-col">
                    {activePersona ? (
                        <>
                            <header className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-4 text-center rounded-tr-2xl shadow-sm border-b dark:border-gray-600">
                                <h1 className="text-xl font-bold">{activePersona.name}</h1>
                            </header>
                            <ChatWindow messages={messages} isLoading={isLoading && messages[messages.length - 1]?.sender === 'bot'} />
                            <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <p className="text-lg">Welcome to PersonaCraft</p>
                            <p>Select a persona or create a new one to start chatting.</p>
                         </div>
                    )}
                </main>
            </div>
            {isWizardOpen && <CreationWizard onPersonaCreated={handlePersonaCreated} onClose={() => setWizardOpen(false)} />}
        </div>
    );
}