import db from './index.js';
import { comparePassword, hashPassword } from '../utils/helpers.js';

//* Authentication 
export const findUserByEmail = async (email) => {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

export const findUserById = async (id) => {
    return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};


//* routes
export const createUser = async (req, res) => {
    const {email, password, firstname, lastname} = req.body;

    const hashedPassword = await hashPassword(password);

    db.none('INSERT INTO users(email, password, firstname, lastname) VALUES ($1, $2, $3, $4)', [email, hashedPassword, firstname, lastname])
        .then(() => {
            res.status(201).send('Successfully registered: ' + email + '. Please log in to access your account.');
        })
        .catch(error => {
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        });
};

export const getUsers = async (req, res) => {
    db.any('SELECT * FROM users ORDER BY id ASC')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    db.oneOrNone('SELECT * FROM users WHERE id = $1', [id])
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const updateUser = async (req, res) => {
    const { id } = req.user;
    const { email, password, firstname, lastname } = req.body;

    console.log(req.body);

    if(!email && !password && !firstname && !lastname) {
        return res.status(400).send('No fields to update');
    }

    db.oneOrNone('SELECT * FROM users WHERE id = $1', [id])
        .then(async user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            //! This would be more in line with a patch request
            const updateEmail = email && email !== user.email;
            let updatePassword = false;
            if(password) updatePassword = !await comparePassword(password, user.password);
            const updateFirstname = firstname && firstname !== user.firstname;
            const updateLastname = lastname && lastname !== user.lastname;

            if (!updateEmail && !updatePassword && !updateFirstname && !updateLastname) {
                return res.status(400).send('All fields are the same.');
            }

            const sql = `UPDATE users SET ${updateEmail ? 'email = $1' : ''}${updateEmail && updatePassword ? ", " : ""}${updatePassword ? 'password = $2' : ''} ${updateFirstname && updatePassword ? ", " : ""}${firstname && firstname !== user.firstname ? 'firstname = $3' : ''}${updateFirstname && updateLastname ? ", " : ""}${lastname && lastname !== user.lastname ? 'lastname = $4' : ''} WHERE id = $5`;
            console.log('SQL Query:', sql);
            db.none(sql, [email, await hashPassword(password), firstname, lastname, id])
                .then(() => {
                    res.status(200).send(`User with ID: ${id} updated`);
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch(error => {
            console.error('Error fetching user for update:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    //Check user actually exists
    db.oneOrNone('SELECT * FROM users WHERE id = $1', [id])
        .then(user => {
            if(!user) {
                return res.status(404).send('User not found');
            }
            db.none('DELETE FROM users WHERE id = $1', [id])
                .then(() => {
                    res.status(200).send(`User with ID: ${id} deleted`);
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch(error => {
            console.error('Error user does not exist:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getItems = (req, res) => {
    //checks for any query
    if(!req.query) {
        db.any('SELECT name, description, price FROM items ORDER BY id ASC')
        .then(items => {
            items.forEach(item => { item.price = '$' + item.price; });
            res.status(200).json(items);
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            res.status(500).send('Internal Server Error');
        });
    } else if (req.query.category) {
        // Using category filter
        const { category } = req.query;
        db.any('SELECT items.name, items.description, items.price FROM items JOIN categories ON items.category_id = categories.id WHERE categories.name = $1', [category])
            .then(items => {
                if (items.length > 0) {
                    items.forEach(item => { item.price = '$' + item.price; });
                    res.status(200).json(items);
                } else {
                    res.status(404).send(`No items found in category: ${category}`);
                }
            })
            .catch(error => {
                console.error('Error fetching items by category:', error);
                res.status(500).send('Internal Server Error');
            });
    }  else if (req.query.price) {
        const { price, higher } = req.query;
        console.log('Price:', price, 'Higher:', higher);

        db.any(`SELECT items.name, items.description, items.price, categories.name as category FROM items JOIN categories ON items.category_id = categories.id WHERE items.price ${higher === 'true' ? '>=' : '<='} $1`, [price])
            .then(items => {
                if (items.length > 0) {
                    items.forEach(item => { item.price = '$' + item.price; });
                    res.status(200).json(items);
                } else {
                    res.status(404).send(`No items found ${higher === 'true' ? 'over' : 'under'}: $${price}`);
                }
            })
            .catch(error => {
                console.error('Error fetching items by category:', error);
                res.status(500).send('Internal Server Error');
            });
    }

    
}

export const getItemById = (req, res) => {
    const id = parseInt(req.params.id);
    db.oneOrNone('SELECT * FROM items WHERE id = $1', [id])
        .then(item => {
            if (item) {
                res.status(200).json(item);
            } else {
                res.status(404).send('Item not found');
            }
        })
        .catch(error => {
            console.error('Error fetching item:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getItemsByCategory = (req, res) => {
    const { category } = req.query;
    db.any('SELECT * FROM items WHERE category = $1 ORDER BY id ASC', [category])
        .then(items => {
            if (items.length > 0) {
                res.status(200).json(items);
            } else {
                res.status(404).send(`No items found in category: ${category}`);
            }
        })
        .catch(error => {
            console.error('Error fetching items by category:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getCarts = (req, res) => {
    db.any('SELECT * FROM carts ORDER BY user_id ASC')
        .then(carts => {
            if (carts.length > 0) {
                res.status(200).json(carts);
            } else {
                res.status(404).send('No carts found');
            }
        })
        .catch(error => {
            console.error('Error fetching carts:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getCartById = (req, res) => {
    const id = parseInt(req.params.id);
    db.any('SELECT * FROM cart_items WHERE cart_id = $1', [id])
        .then(cartItems => {
            if (cartItems) {
                res.status(200).json(cartItems);
            } else {
                res.status(404).send('Cart not found');
            }
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getUserCart = (req, res, next) => {
    const { user } = req;

    if (!user) {
        return next();
    }

    db.oneOrNone('SELECT * FROM carts WHERE user_id = $1', [user.id])
        .then(cart => {
            if (!cart) {
                return res.status(404).send('Cart not found for user');
            }

            req.cart = cart;
            return next();
        })
        .catch(error => {
            console.error('Error fetching user cart:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getItemsInUserCart = (req, res, next) => {
    const { user, cart } = req;

    console.log(user);

    if (!user) {
        return next();
    }

    console.log('Cart:', cart);
    if (!cart) {
        return res.status(404).send('Cart not found for user');
    }
    // Fetch items in the user's cart
    //SELECT cart_items.id, cart_id, items.name, quantity FROM cart_items JOIN items ON cart_items.item_id = items.id WHERE cart_id = 1;
    db.any('SELECT items.id AS items_id, cart_id, items.name, items.price, quantity FROM cart_items JOIN items ON cart_items.item_id = items.id WHERE cart_id = $1', [cart.id])
        .then(cartItems => {
            if (cartItems.length > 0) {
                req.cartItems = cartItems;
                return next();
                // res.status(200).json(cartItems);
            } else {
                res.status(404).send('No items found in your cart');
            }
        })
        .catch(error => {
            console.error('Error fetching items in user cart:', error);
            res.status(500).send('Internal Server Error');
        });

    // db.oneOrNone('SELECT * FROM carts WHERE user_id = $1', [user.id])
    //     .then(cart => {
    //         console.log('Cart:', cart);
    //         if (!cart) {
    //             return res.status(404).send('Cart not found for user');
    //         }
    //         // Fetch items in the user's cart
    //         //SELECT cart_items.id, cart_id, items.name, quantity FROM cart_items JOIN items ON cart_items.item_id = items.id WHERE cart_id = 1;
    //         db.any('SELECT items.id AS items_id, cart_id, items.name, quantity FROM cart_items JOIN items ON cart_items.item_id = items.id WHERE cart_id = $1', [cart.id])
    //             .then(cartItems => {
    //                 if (cartItems.length > 0) {
    //                     res.status(200).json(cartItems);
    //                 } else {
    //                     res.status(404).send('No items found in your cart');
    //                 }
    //             });
    //     })
    //     .catch(error => {
    //         console.error('Error fetching user cart:', error);
    //         res.status(500).send('Internal Server Error');
    //     });

}

export const checkCartExists = (req, res, next) => {
    const { id } = req.user;

    db.oneOrNone('SELECT * FROM carts WHERE user_id = $1', [id])
        .then(cart => {
            //creates cart if one doesnt already exists
            if (!cart) {
                db.one('INSERT INTO carts(user_id) VALUES ($1) RETURNING *', [id])
                    .then(cart => {
                        console.log('Cart created for user,', cart);
                        req.cart = cart;
                        next();
                    }).catch(error => {
                        console.error('Error creating cart:', error);
                        res.status(500).send('Internal Server Error');
                    })
            } else {
                req.cart = cart;
                next();
            }
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const addToCart = (req, res, next) => {
    const { cart } = req;
    const { itemName, quantity } = req.body;

    if (!itemName || !quantity) {
        return res.status(400).send('Item name and quantity are required');
    }

    if(!cart) {
        return res.status(400).send('Cart does not exist');
    }

    db.oneOrNone('SELECT * FROM items WHERE name = $1', [itemName])
        .then(item => {
            if (!item) {
                return res.status(404).send('Item not found');
            }
            
            // Check if the item already exists in the cart
            db.oneOrNone('SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2', [cart.id, item.id])
                .then(cartItem => {
                    if (cartItem) {
                        // If the item already exists, update the quantity
                        const newQuantity = cartItem.quantity + quantity;
                        db.none('UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND item_id = $3', [newQuantity, cart.id, item.id])
                            .then(() => {
                                next();
                                //res.status(200).send(`Updated quantity of ${itemName} to ${newQuantity} in cart.`);
                            })
                            .catch(error => {
                                console.error('Error updating item quantity in cart:', error);
                                res.status(500).send('Internal Server Error');
                            });
                    } else {
                        db.none('INSERT INTO cart_items(cart_id, item_id, quantity) VALUES ($1, $2, $3)', [cart.id, item.id, quantity])
                            .then(() => {
                                next();
                                //res.status(200).send(`Added ${quantity} of ${itemName} to cart.`);
                            })
                            .catch(error => {
                                console.error('Error adding item to cart:', error);
                                res.status(500).send('Internal Server Error');
                            });
                    }
                });
        });
}

export const updateCartModifiedTime = (req, res) => {
    const { cart } = req;

    db.none('UPDATE carts SET modified = NOW() WHERE id = $1', [cart.id])
    .then(() => {
        res.status(200).send(`Cart with ID: ${cart.id} modified time updated`);
    })
    .catch(error => {
        console.error('Error updating cart modified time:', error);
        res.status(500).send('Internal Server Error');
    });
}

export const deleteCartById = (req, res) => {
    const id = parseInt(req.params.id);

    db.oneOrNone('DELETE FROM carts WHERE id = $1 RETURNING *', [id])
        .then(cart => {
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
            res.status(200).send(`Cart with ID: ${id} deleted`);
        })
        .catch(error => {
            console.error('Error deleting cart:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const deleteLoggedInUserCart = (req, res) => {
    const { user } = req;

    if (!user) {
        return res.status(401).send('User not logged in');
    }

    db.oneOrNone('SELECT * FROM carts WHERE user_id = $1', [user.id])
        .then(cart => {
            if (!cart) {
                return res.status(404).send('Cart not found for user');
            }
            db.none('DELETE FROM carts WHERE user_id = $1', [user.id])
                .then(() => {
                    res.status(200).send(`Cart for user with ID: ${user.id} deleted`);
                })
                .catch(error => {
                    console.error('Error deleting user cart:', error);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch(error => {
            console.error('Error fetching user cart:', error);
            return res.status(500).send('Internal Server Error');
        });
}

export const checkoutCart = async (req, res) => {
    const { user, cartItems } = req;

    if (!user || !cartItems) {
        return res.status(401).send('User, Cart or Items are missing.');
    }

    // payment details would be handled here
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // console.log("Checkout: ", cart, cartItems);
    // console.log('Total Price:', totalPrice);

    await db.one("INSERT INTO orders(total, status, user_id) VALUES ($1, 'PAID', $2) RETURNING *", [totalPrice, user.id])
        .then(order => {
            // Insert each item in the cart into the order_items table
            cartItems.forEach(item => {
                db.none('INSERT INTO order_items(order_id, item_id, quantity, price, name) VALUES ($1, $2, $3, $4, $5)', [order.id, item.items_id, item.quantity, item.price, item.name])
                    .then(() => {
                        console.log(`Item ${item.name} added to order ${order.id}`);
                    })
                    .catch(error => {
                        console.error(`Error adding item ${item.name} to order:`, error);
                    });
            });
        })
        .catch(error => {
            console.error('Error creating order:', error);
            return res.status(500).send('Internal Server Error');
        });

    db.none('DELETE FROM carts WHERE user_id = $1', [user.id])
        .then(() => {
            res.send('Checkout successful, cart has been cleared');
        })
        .catch(error => {
            console.error('Error clearing cart after checkout:', error);
            res.status(500).send('Internal Server Error');
        });

}

export const getOrders = (req, res) => {
    db.any('SELECT * FROM orders ORDER BY id ASC')
        .then(orders => {
            if (orders.length > 0) {
                orders.forEach(order => {
                    order.total = "$" + order.total;
                });
                res.status(200).json(orders);
            } else {
                res.status(404).send('No orders found');
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getOrderById = (req, res) => {
    const id = parseInt(req.params.id);
    db.any('SELECT * FROM order_items WHERE order_id = $1', [id])
        .then(items => {
            if (items) {
                items.forEach(item => {
                    item.price = "$" + item.price;
                });
                res.status(200).json(items);
            } else {
                res.status(404).send('Order not found');
            }
        })
        .catch(error => {
            console.error('Error fetching order:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getUserOrders = (req, res) => {
    const { user } = req;

    db.any('SELECT * FROM orders WHERE user_id = $1 ORDER BY modified DESC', [user.id])
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.status(404).send('No orders found for user');
            }
        })
        .catch(error => {
            console.error('Error fetching user orders:', error);
            res.status(500).send('Internal Server Error');
        });
}

export const getUserOrderItems = (req, res) => {
    //const { user, orders } = req;
    const orderID = req.params.id

    db.any('SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC', [orderID])
        .then(items => {
            if (items.length > 0) {
                items.forEach(item => {
                    item.price = "$" + item.price;
                });
                res.status(200).json(items);
            } else {
                res.status(404).send('No items found in order.');
            }
        })
        .catch(error => {
            console.error('Error fetching user orders:', error);
            res.status(500).send('Internal Server Error');
        });
}