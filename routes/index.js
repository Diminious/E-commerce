import express from 'express';
import usersRouter from './users.js';
import authRouter from './auth.js';
import itemsRouter from './items.js';

const router = express.Router();

router.use('/api', usersRouter);
router.use('/api', authRouter);
router.use('/api', itemsRouter);
// Add other routers as needed

export default router;