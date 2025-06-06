import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from '../db/queries.js';
import { getLoggedInUser, checkAuthorised } from '../utils/middleware.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/profile', checkAuthorised, getLoggedInUser); 
router.put('/users/profile', checkAuthorised, updateUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;