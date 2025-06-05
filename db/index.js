// const { Pool, Client } = require('pg');
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'e-commerce',
    user: 'postgres',
    password: 'postgres'
})

export default db;

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'e-commerce',
//     password: 'postgres',
//     port: '5432'
// });

// const query = (text, params, callback) => {
//     const start = Date.now();
//     const res = pool.query(text, params, callback);
//     const duration = Date.now() - start;
//     console.log('executed query', { text, duration });
    
//     return res;
// }

// module.exports = {query};
