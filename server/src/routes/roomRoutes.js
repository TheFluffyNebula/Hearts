// src/routes/roomRoutes.js
import express from 'express';
import { createRoom, joinRoom, leaveRoom, startGame } from '../controllers/roomController.js';

const router = express.Router();

router.post('/', createRoom);
router.post('/join', joinRoom);
router.post('/leave', leaveRoom);
router.post('/start', startGame);

export default router;