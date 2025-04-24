const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'postgres',
    port: '5432'
});

const query = (text, params, callback) => {
    const start = Date.now();
    const res = pool.query(text, params, callback);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration });
    
    return res;
}

module.exports = {query};
