const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});





function getUserDash(response, memberId) {

    // Searches Database for user with the memberID
    const sql_query = 'SELECT name FROM librarydev WHERE member_id = ?';
    var name = '';

    // Gets information from backend
    link.query(sql_query, [memberId], (error, result) => {
        if (result.length > 0) {
            console.log('Error retrieving name with memberId');
        } else {
           console.log('Member found');
           name = '<a class="user-greet">Welcome, ';
           name += result[0];
           name += 'User!</a>';
           console.log(name);
           response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(name, 'utf-8');
        }
    });
   
    
    
}

module.exports = { getUserDash };
