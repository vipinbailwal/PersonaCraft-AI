import Persona from '../models/Persona.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const CHAT_HISTORY_LIMIT = 20; // Set your limit here (e.g., 20 messages = 10 user/bot pairs)

export const getChatHistory = async (req, res) => {
    // ... (This function remains the same)
};

export const sendMessage = async (req, res) => {
    const { personaId, message } = req.body;
    try {
        const persona = await Persona.findOne({ _id: personaId, user: req.user });
        if (!persona) return res.status(404).json({ error: "Persona not found" });
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: persona.systemInstruction,
        });

        // Use only the most recent history for context
        const recentHistory = persona.chatHistory.slice(-CHAT_HISTORY_LIMIT);
        const chat = model.startChat({ history: recentHistory });
        const result = await chat.sendMessageStream(message);

        // Add the user's new message
        persona.chatHistory.push({ role: 'user', parts: [{ text: message }] });

        let botResponse = '';
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'no-cache');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            botResponse += chunkText;
            res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
        }
        
        // Add the bot's new response
        persona.chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });
        
        // *** THE FIX IS HERE: Trim the history before saving ***
        if (persona.chatHistory.length > CHAT_HISTORY_LIMIT) {
            persona.chatHistory = persona.chatHistory.slice(-CHAT_HISTORY_LIMIT);
        }
        
        await persona.save();
        
        res.end();

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).end();
    }
};