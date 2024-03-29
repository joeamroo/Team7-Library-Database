const connection = require('./dbConnection');

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
        console.log(transactionId);

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ transactionId }));
    });
}

module.exports = { insertTransactionInfo };