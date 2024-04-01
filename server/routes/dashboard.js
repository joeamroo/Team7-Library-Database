const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});





function getUser(response, user) {
    const sql_query = 'SELECT';
    
   
    
    
}

module.exports = { getUser };
