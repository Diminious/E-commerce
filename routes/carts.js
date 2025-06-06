import express from 'express';
import { checkCartExists, getUserCart, addToCart, getItemsInUserCart, getCartById, getCarts, deleteCartById, deleteLoggedInUserCart, updateCartModifiedTime } from '../db/queries.js';
import { checkAuthorised } from '../utils/middleware.js';

const router = express.Router();

router.get('/carts', getUserCart, getItemsInUserCart, getCarts);
router.get('/carts/:id', getCartById);

router.post('/carts', checkAuthorised, checkCartExists, addToCart, updateCartModifiedTime);
//router.post('/carts/checkout', checkAuthorised, getUserCart, checkoutCart);

router.delete('/carts', checkAuthorised, deleteLoggedInUserCart);
router.delete('/carts/:id', deleteCartById);

export default router;