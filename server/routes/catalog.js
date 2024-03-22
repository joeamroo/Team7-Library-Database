const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to LibraryDev database');
});

function getInitialCatalogInfo(response) {
    const query = 'SELECT * FROM catalog_view LIMIT 3';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let catalogHtml = '<h1>Catalog</h1>';

        results.forEach(item => {
            catalogHtml += <div class='catalog-item'>
                <h3>${item.title}</h3>
                <p>Autho/Director/Brand: ${item.author_director_brand}</p>
                <p>Type: ${item.asset_type}</p>
                <p>ISBN/ID: ${item.isbn_id}</p>
                <p>Year Published/Released: ${item.year_published_released}</p>
                <p>Current Holds: ${item.current_holds}</p>
                <p>Available Items: ${item.available_items}</p>
            </div>;
        });

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(catalogHtml, 'utf-8');
    });
}

module.exports = { getInitialCatalogInfo };