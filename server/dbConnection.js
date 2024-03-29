const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to LibraryDev database');
});

module.exports = pool;