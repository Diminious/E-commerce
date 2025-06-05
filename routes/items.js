import express from 'express';
import { getItems, getItemById, getItemsByCategory } from '../db/queries.js';

const router = express.Router();

router.get('/items', getItems);
router.get('/items/:id', getItemById);

export default router;