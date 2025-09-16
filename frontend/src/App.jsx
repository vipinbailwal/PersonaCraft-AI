// src/App.jsx

import React from 'react'; // Make sure React is imported
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        // You can add a full-page loading spinner here later
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>; 
    }
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        // THE FIX: <Router> must be on the outside, wrapping everything.
        <Router> 
            <AuthProvider> 
                <Toaster position="top-center" reverseOrder={false} />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <ChatPage />
                        </PrivateRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;