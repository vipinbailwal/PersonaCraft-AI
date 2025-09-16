import express from 'express';
import { createPersona, getPersonas, deletePersona } from '../controllers/personaController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
    .get(protect, getPersonas)
    .post(protect, upload.single('chatFile'), createPersona);

router.route('/:id').delete(protect, deletePersona);

export default router;