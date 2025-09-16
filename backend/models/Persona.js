import mongoose from 'mongoose';
const personaSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    systemInstruction: { type: String, required: true },
    chatHistory: { type: Array, default: [] },
}, { timestamps: true });
export default mongoose.model('Persona', personaSchema);