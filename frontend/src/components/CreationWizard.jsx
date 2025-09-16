import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UploadCloud, User, Heart, MessageSquare, Loader2, X } from 'lucide-react';

export default function CreationWizard({ onPersonaCreated, onClose }) {
    const [file, setFile] = useState(null);
    const [personaName, setPersonaName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !personaName || !relationship || !customPrompt) {
            toast.error('Please fill out all fields.');
            return;
        }
        setIsLoading(true);
        const loadingToast = toast.loading('Creating persona... this may take a moment.');

        const formData = new FormData();
        formData.append('chatFile', file);
        formData.append('personaName', personaName);
        formData.append('relationship', relationship);
        formData.append('customPrompt', customPrompt);

        try {
            const response = await api.post('/personas', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Persona created successfully!', { id: loadingToast });
            onPersonaCreated(response.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create persona.', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Create a New Persona</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${file ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                             <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className={file ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}/>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{file ? file.name : 'Click to upload WhatsApp .txt chat'}</span></p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".txt" onChange={e => setFile(e.target.files[0])} />
                        </label>
                    </div>

                    <InputField icon={<User size={18}/>} placeholder="Persona Name (e.g., Sarah)" value={personaName} onChange={e => setPersonaName(e.target.value)} />
                    <InputField icon={<Heart size={18}/>} placeholder="Your Relationship (e.g., Best Friend)" value={relationship} onChange={e => setRelationship(e.target.value)} />
                    <InputField icon={<MessageSquare size={18}/>} placeholder="Core Instruction (e.g., 'Be supportive and funny')" value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} />

                    <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center transition-colors">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Create Persona'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const InputField = ({ icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">{icon}</div>
        <input {...props} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
    </div>
);