// src/components/Sidebar.jsx
import React from 'react'; // <-- ADD THIS LINE
import useAuth from '../hooks/useAuth';
import { PlusCircle, LogOut, Trash2 } from 'lucide-react';



export default function Sidebar({ personas, activePersona, setActivePersona, onNewPersonaClick, onDeletePersona }) {
    const { logout } = useAuth();
    
    return (
        <aside className="w-64 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col rounded-l-2xl">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Personas</h2>
                <button onClick={logout} className="p-1 text-gray-500 hover:text-red-500" title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul>
                    {personas.map(p => (
                        <li key={p._id} 
                            className={`flex justify-between items-center p-3 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 ${activePersona?._id === p._id ? 'bg-indigo-100 dark:bg-indigo-900 font-semibold' : ''}`}
                            onClick={() => setActivePersona(p)}
                        >
                            <span>{p.name}</span>
                            <button onClick={(e) => { e.stopPropagation(); onDeletePersona(p._id); }} className="p-1 text-gray-400 hover:text-red-500 opacity-50 hover:opacity-100">
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 border-t dark:border-gray-700">
                <button onClick={onNewPersonaClick} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    <PlusCircle size={20} />
                    New Persona
                </button>
            </div>
        </aside>
    );
}