const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to LibraryDev database');
});

function insertTransactionInfo(response, memberId, checkout_items) {
    const insertQuery = 'INSERT INTO transaction (member_id) values (?)';
    connection.query(insertQuery, [memberId], (err, result) => {
        if (err) {
            console.error('Error inserting tuple into transaction table:', err);
            response.statusCode = 500;
            response.end('Internal Server Error');
            return;
        }

        const transactionId = result.insertId;

        checkout_items.forEach(item => {
            const {type, id} = item;
            const bridgeTable = `${type}_transaction`;
            const insertBridgeQuery = `INSERT INTO ${bridgeTable} (transaction_id, ${type}_id) VALUES (?, ?)`;
            connection.query(insertBridgeQuery, [transactionId, id]);

            const updateAvailableCopies = `UPDATE ${type} SET available_copies = available_copies - 1 WHERE ${type}_id = ?`;
            connection.query(updateAvailableCopies, [id]);
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ transactionId }));
    });
}

// Handle availabiluty for catalog!!!
// Remember to handle the hold requests 
module.exports = { insertTransactionInfo };