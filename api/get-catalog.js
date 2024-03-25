const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'library-database-sytem.mysql.database.azure.com',
  user: 'lbrGuest',
  password: 'gu3st@cces$',
  database: 'librarydev',
});

// API route to fetch initial data
module.exports = async (req, res) => {
  const query = 'SELECT * FROM catalog_view LIMIT 4';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error querying initial data:', err);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    res.status(200).json(results);
  });
};