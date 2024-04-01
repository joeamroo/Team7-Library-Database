const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});



// Example usage with a hypothetical user login function
function registerUser(res, first_name, last_name, address, city_addr, state, zipcode_addr, email, password) {
        const sql_query = 'INSERT INTO member' +
                         '(first_name, last_name, address, city_addr, state, zipcode_addr, email, password)' +
                         'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
connection.query(sql, values, (error, results, fields) => {
        if (error) {
            // Handle error
            console.error(error);
                return;
        }
            // Success
            console.log(`User added');
        });
    }
}

module.exports = { registerUser };