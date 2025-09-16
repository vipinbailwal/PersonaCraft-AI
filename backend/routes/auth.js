import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { check } from 'express-validator';
const router = express.Router();

router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], registerUser);

router.post('/login', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
], loginUser);

export default router;