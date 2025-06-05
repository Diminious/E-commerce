import express from 'express';
import usersRouter from './users.js';
import authRouter from './auth.js';

const router = express.Router();

router.use('/api', usersRouter);
router.use('/api', authRouter);
// Add other routers as needed

export default router;