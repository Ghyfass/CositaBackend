require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

pool.getConnection()
  .then(conn => {
    console.log(`✅ MySQL conectado — base de datos: ${process.env.DB_NAME}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
  });

module.exports = pool;