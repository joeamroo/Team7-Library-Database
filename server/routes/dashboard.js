const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});





function getUserDash(response, memberID) {

    // Searches Database for user with the memberID
    const sql_query = 'SELECT name FROM librarydev WHERE member id = ?';

    // Gets information from backend
    link.query(sql_query, [memberID], (error, result) => {
        if (error) {
            console.log('Error retrieving name with memberId');
        } else {
           console.log('Member found');
           response.writehead(200, {'Content-Type': 'application/json'});
           response.end(JSON.stringify({sql_query}));
        }
    });
   
    
    
}

module.exports = { getUserDash };
