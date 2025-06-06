import express from 'express';
import usersRouter from './users.js';
import authRouter from './auth.js';
import itemsRouter from './items.js';
import cartsRouter from './carts.js';

const router = express.Router();

router.use('/api', usersRouter);
router.use('/api', authRouter);
router.use('/api', itemsRouter);
router.use('/api', cartsRouter);
// Add other routers as needed

export default router;