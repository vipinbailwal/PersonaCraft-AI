import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import personaRoutes from './routes/personas.js';
import chatRoutes from './routes/chat.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Update if your frontend port is different
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🤖 PersonaCraft server running on port ${PORT}`));