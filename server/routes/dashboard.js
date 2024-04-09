const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});





function getUserDashGreet(response, memberId) {

    // Searches Database for user with the memberID
    const query_name = 'SELECT name FROM member WHERE member_id = ?';
    let name = '';

    // Gets information from backend
    link.query(query_name, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
           console.log(result);
           name = 'Welcome, ';
           name += result[0].name;
           name += '!';
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(name, 'utf-8');
    });
    
}


function getUserDashInfo(response, memberId, name, email, mem_type, phone_number, street_addr, 
                                   city_addr, city_addr, state, zipcode_addr) {

    // Searches Database for user with memberID
    const query_info = 'SELECT name, email, status, mem_type, phone_number, street_addr,\
                        city_addr, state, zipcode_addr FROM member WHERE member_id = ?';
    
    link.query(query_info, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
            console.log('Successful retrieval!');
        }

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(
            result[0].name, result[0].email, result[0].status, result[0].mem_type,
            result[0].phone_number, result[0].street_addr, result[0].city_addr, 
            result[0].city_addr, result[0].state, result[0].zipcode_addr,
            result[0].fine
        ));
    });
    
}

module.exports = { getUserDashGreet, getUserDashInfo };
