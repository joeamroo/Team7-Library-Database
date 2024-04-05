const fs = require('fs');
const mysql = require('mysql');

const librLink = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

const accessLink = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'access_control',
    port:3306
});




// registration
function registerMember(res, full_name, address, city_addr, state, zipcode_addr, phone_num, email, password, memType) {
    // insert into access control first
    accessLink.query('INSERT INTO member_credentials (member_password, member_email) VALUES (?, ?)', [password, email], (credentialErr, result) => {
        if (credentialErr) {
            console.log('error accessing access_control db table:', credentialErr);
        }
    });

    librLink.query('INSERT INTO member (password, name, email, mem_type, phone_number, street_addr, city_addr, state, zipcode_addr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [password, full_name, email, memType, phone_num, address, city_addr, state, zipcode_addr], (newMemErr, result) => {
        if (newMemErr) {
            console.log('error entering new member into librarydev db:', newMemErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'accountCreationSuccessful' }));
}

module.exports = { registerMember };