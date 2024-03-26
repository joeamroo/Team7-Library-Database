const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});





function getReturns(response) {
    const sql_query = 'SELECT * FROM book';
    
    link.query(sql_query, (err, results) => {


        let returns = '';

        results.forEach(item => {
            returns += '<tr>Test</tr>';
        });

        const parent = fs.readFileSync('./front-end/dashboard/dashboard.html', 'utf-8');
        const child = parent.replace('<!--orders-->', returns);

        response.writeHead(200, { 'Content-Type': 'text/html'});
        response.end(child, 'utf-8');
    });
    
    
}











module.exports = { getReturns };
