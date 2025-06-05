import express from 'express';
import { getUsers, getUserById, deleteUser } from '../db/queries.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;