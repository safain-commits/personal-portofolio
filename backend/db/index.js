require('dotenv').config();
const mysql = require('mysql2/promise');

// Parse the existing DATABASE_URL for simplicity or use default MySQL uri format
// Format expected: mysql://user:password@localhost:3306/portfolio
const pool = mysql.createPool(process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/portfolio');

module.exports = {
  // We mimic the pg query standard return format somewhat (array vs object) 
  // to avoid having to refactor the entire query response extraction if possible,
  // but we will update queries.js anyway.
  query: async (text, params) => {
    const [rows, fields] = await pool.execute(text, params);
    return { rows, fields };
  },
  pool,
};
