import express from 'express';
import { getOrders, getOrderById, getUserOrders, getUserOrderItems } from '../db/queries.js';
import { checkAuthorised } from '../utils/middleware.js';

const router = express.Router();

router.get('/orders', getOrders);
router.get('/orders/user', checkAuthorised, getUserOrders);
router.get('/orders/user/:id', checkAuthorised, getUserOrderItems);
router.get('/orders/:id', getOrderById);
router.get('/orders/:id/:order_id', getUserOrderItems)

export default router;