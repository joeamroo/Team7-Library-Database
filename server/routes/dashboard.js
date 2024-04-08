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
    const sql_query = 'SELECT name FROM member WHERE member_id = ?';
    let name = '';

    // Gets information from backend
    link.query(sql_query, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
           console.log('Member found');
           name = '<a class="user-greet">Welcome, ';
           name += result;
           name += 'User!</a>';
           console.log(name);
           
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(name, 'utf-8');
    });
    
    
    
}

module.exports = { getUserDash };
