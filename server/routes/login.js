const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const crypto = require('crypto');


const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'access_control',
    port:3306
});
  



function verifyPassword(receivedHashedPassword, storedHashedPassword) {
    // Compare the received hashed password with the stored one
    return receivedHashedPassword === storedHashedPassword;
}

// Example usage with a hypothetical user login function
function loginUser(username, receivedHashedPassword) {
    // Placeholder for retrieving the stored hashed password for a user
    const storedHashedPassword = getUserStoredPassword(username);

    if (verifyPassword(receivedHashedPassword, storedHashedPassword)) {
        console.log('Login successful');
        // Proceed with login process
    } else {
        console.log('Login failed: Incorrect password');
        // Handle login failure
    }
}

function getUserStoredPassword(username) {
    // Placeholder function for fetching the stored hashed password
    // In a real application, this would query your database
    // For this example, let's assume the stored password is 'exampleHashedPassword'
    return 'd033e22ae348aeb5660fc2140aec35850c4da997';
}



// Simulate a login attempt
//loginUser('john_doe', receivedHashedPassword);



module.exports = { verifyPassword };