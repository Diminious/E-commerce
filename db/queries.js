const {query} = require('./index');

const createUser = (req, res) => {
    const {username, password, email} = req.body;

    query('INSERT INTO users(username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, password, email], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
};

const getUsers = (req, res) => {
    query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
};