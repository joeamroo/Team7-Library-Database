const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const crypto = require('crypto');


const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});
  

function authValidation(hash, salt, iterations, attempts) {
    const keylength = 64;
    const digest = 'sha512';
    const isHash = crypto.pbkdf2Sync(attempts, salt, iterations, digest).toString('base64');
    return hash == isHash;
}

function getCredentials(response) {
    const filePath = './front-end/login/member-login.html';
    
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            // If there's an error reading the file, send a 500 Internal Server Error response
            console.error('Error reading file:', err);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal server error');
            return;
        }

        // If the file is read successfully, send a 200 OK response with the file's content
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(content, 'utf-8');
    });
}



module.exports = { getCredentials };