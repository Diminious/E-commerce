import express from 'express';
import { checkCartExists, checkoutCart, getUserCart, addToCart, getItemsInUserCart, getCartById, getCarts, deleteCartById, deleteLoggedInUserCart, updateCartModifiedTime } from '../db/queries.js';
import { checkAuthorised } from '../utils/middleware.js';

const router = express.Router();

router.get('/carts', getUserCart, getItemsInUserCart, (req, res, next) => {
    const { user, cartItems } = req;
    if (!user) return next();
    if (!cartItems) {
        return res.status(404).send('No items found in the cart.');
    }

    res.status(200).json(cartItems);
}, getCarts);
router.get('/carts/:id', getCartById);

router.post('/carts', checkAuthorised, checkCartExists, addToCart, updateCartModifiedTime);
router.post('/carts/checkout', checkAuthorised, getUserCart, getItemsInUserCart, checkoutCart);

router.delete('/carts', checkAuthorised, deleteLoggedInUserCart);
router.delete('/carts/:id', deleteCartById);

export default router;