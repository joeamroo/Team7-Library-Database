const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});


function updateFine(res, memberId) {
    connection.query(`UPDATE member SET fine = 0 WHERE member_id = ?`, [memberId], (updMemErr, result) => {
        if (updMemErr) {
            console.log('error updating member fine into librarydev db:', updMemErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'fineUpdateSuccessful' }));
}

module.exports = { updateFine };