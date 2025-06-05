import db from './index.js';

//* Authentication 
export const findUserByEmail = async (email) => {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

export const findUserById = async (id) => {
    return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};


//* routes
export const createUser = (req, res) => {
    const {email, password, firstname, lastname} = req.body;

    db.none('INSERT INTO users(email, password, firstname, lastname) VALUES ($1, $2, $3, $4)', [email, password, firstname, lastname])
        .then(() => {
            res.status(201).send('Successfully registered: ' + email);
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
    db.any('SELECT * FROM items ORDER BY id ASC')
        .then(items => {
            res.status(200).json(items);
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            res.status(500).send('Internal Server Error');
        });
}

const getItemById = (req, res) => {
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

const getItemsByCategory = (req, res) => {
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