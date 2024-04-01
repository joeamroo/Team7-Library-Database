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
            if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('Member has fine. Transaction Denied')) {
                response.statusCode = 403;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({message: 'Transaction denied. You have an outstanding fine. Please pay your fine to proceed with the checkout.'}));
            }
            else {
                console.error('Error inserting tuple into transaction table:', err);
                response.statusCode = 500;
                response.end('Internal Server Error');
            }
            return;
        }

        const transactionId = result.insertId;
        updatePromises = [];

        checkout_items.forEach(item => {
            const {type, id} = item;
            const bridgeTable = `${type}_transaction`;
            const insertBridgeQuery = `INSERT INTO ${bridgeTable} (transaction_id, ${type}_id) VALUES (?, ?)`;
            connection.query(insertBridgeQuery, [transactionId, id]);

            if (type === 'book') {
                const updateAvailableCopiesQuery = 'UPDATE book SET available_copies = available_copies - 1 WHERE isbn = ?';
                connection.query(updateAvailableCopiesQuery, [id]);
            } 
            else if (type === 'movie') {
                const updateAvailableCopiesQuery = 'UPDATE movie SET available_copies = available_copies - 1 WHERE movie_id = ?';
                connection.query(updateAvailableCopiesQuery, [id]);
            } 
            else if (type === 'device') {
                const updateAvailableCopiesQuery = 'UPDATE device SET available_copies = available_copies - 1 WHERE device_id = ?';
                connection.query(updateAvailableCopiesQuery, [id]);
            }
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ transactionId }));
    });
}

// Remember to handle the hold requests 
module.exports = { insertTransactionInfo };