import Persona from '../models/Persona.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const createPersona = async (req, res) => {
    try {
        const { personaName, relationship, customPrompt } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "Chat file is required." });
        }
        const chatFileContent = req.file.buffer.toString('utf-8');

        // Step 1: AI Moderation
        const moderationPrompt = `Analyze the following text, which includes a user's prompt and chat data. Respond with only one word: 'SAFE' if the content is free of profanity, vulgarity, hate speech, explicit adult themes, and harmful instructions. Respond with 'UNSAFE' if it contains any of these elements. Do not provide any explanation. Here is the text: "${customPrompt} ${chatFileContent}"`;
        const moderationResult = await model.generateContent(moderationPrompt);
        if (moderationResult.response.text().trim().toUpperCase() !== 'SAFE') {
            return res.status(400).json({ error: "Content violates safety guidelines." });
        }

        // Step 2: AI Summarization
        const summarizationPrompt = `Summarize the communication style of the main person from this chat log. Focus on their tone, common phrases, emoji usage, and sentence structure. Be concise and capture the essence of their personality. Here is the chat log: "${chatFileContent}"`;
        const summarizationResult = await model.generateContent(summarizationPrompt);
        const dynamicSummary = summarizationResult.response.text();

        // Step 3: Assemble Final System Prompt
        const finalSystemPrompt = `
            [Your Custom Rule]: '${customPrompt}'
            [Your Role Context]: 'Your role is to act as the user's ${relationship}.'
            [Personality Blueprint]: Your communication style is as follows, based on an analysis of their chats: ${dynamicSummary}
            
            You must now embody this persona. Do not break character. Begin the conversation naturally based on this personality.`;

        const newPersona = new Persona({
            user: req.user,
            name: personaName,
            systemInstruction: finalSystemPrompt,
        });

        const savedPersona = await newPersona.save();
        res.status(201).json({ id: savedPersona._id, name: savedPersona.name });

    } catch (error) {
        console.error("Persona Creation Error: ", error);
        res.status(500).json({ error: "Server error during persona creation." });
    }
};

export const getPersonas = async (req, res) => {
    try {
        const personas = await Persona.find({ user: req.user }).select('_id name');
        res.json(personas);
    } catch (error) {
        res.status(500).json({ error: "Server error fetching personas." });
    }
};

export const deletePersona = async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id);
        if (!persona) return res.status(404).json({ error: 'Persona not found' });
        if (persona.user.toString() !== req.user) return res.status(401).json({ error: 'User not authorized' });
        
        await persona.deleteOne();
        res.json({ message: 'Persona removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting.' });
    }
};