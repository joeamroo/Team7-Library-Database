const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function getFineAmount(res, memberId) {
    connection.query(`SELECT fine FROM member WHERE member_id = ?`, [memberId], (getFineErr, result) => {
        if (getFineErr) {
            console.log('error getting fine from librarydev db:', getFineErr);
        }
        const gotFine = result[0].fine;
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ gotFine }));
    });
}

function updateFine(res, memberId) {
    connection.query(`UPDATE member SET fine = 0 WHERE member_id = ?`, [memberId], (updMemErr, result) => {
        if (updMemErr) {
            console.log('error updating member fine into librarydev db:', updMemErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'fineUpdateSuccessful' }));
}

module.exports = { updateFine, getFineAmount };