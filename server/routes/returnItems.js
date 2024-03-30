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
    console.log('Connected to LibraryDev database - return items');
});


function getTransactionItems(response, transactionId) {
    console.log('Entered the function hereeeeee');
    const transactionQuery = 'SELECT * FROM transaction_view where transaction_id = (?)';

    let transactionInfoHtml = '';
    connection.query(transactionQuery, [transactionId], (err, results) => {
        if (err) {
            console.error('Error querying transaction data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        results.forEach(item => {
            let type = item.asset_type;
            let item_id = item.itemId;

            transactionInfoHtml += '<div class="transac-item"><div class="catalog-item-info>';

            if (type === 'book') {
                connection.query('SELECT book_movie_title_model, authors, image_address FROM catalog_view WHERE isbn = (?)', [item_id], (bookErr, results) => {
                    if (bookErr) {
                        console.error('Error getting book item:', bookErr);
                    }
                    results.forEach(book => {
                        transactionInfoHtml += `<img src="${book.image_address}">`;
                        transactionInfoHtml += '<div class="info">';
                        transactionInfoHtml += `<h3 id="btitle">${book.book_movie_title_model}</h3>`;
                        transactionInfoHtml += `<p>Author: <span id="author">${book.authors}</span></p>`;
                        transactionInfoHtml += `<p>Type: <span id="medium">${type}</span></p>`;
                        transactionInfoHtml += `<p>ISBN: <span id="item_id">${item_id}</span></p>`;
                        transactionInfoHtml += '</div></div>';
                        transactionInfoHtml += '<button class="add-btn" id="addBtn"><i class="add-icon uil uil-plus"></i>Return</button>';
                        transactionInfoHtml += '</div>';
                    });
                });
                
            }
            else if (type === 'movie') {
                connection.query('SELECT book_movie_title_model, director_brand, image_address FROM catalog_view WHERE asset_id = (?)', [item_id], (movieErr, results) => {
                    if (movieErr) {
                        console.error('Error getting movie item:', movieErr);
                    }
                    results.forEach(movie => {
                        transactionInfoHtml += `<img src="${movie.image_address}">`;
                        transactionInfoHtml += '<div class="info">';
                        transactionInfoHtml += `<h3 id="mtitle">${movie.book_movie_title_model}</h3>`;
                        transactionInfoHtml += `<p>Director: <span id="director">${movie.director_brand}</span></p>`;
                        transactionInfoHtml += `<p>Type: <span id="medium">${type}</span></p>`;
                        transactionInfoHtml += `<p>movie ID: <span id="item_id">${item_id}</span></p>`;
                        transactionInfoHtml += '</div></div>';
                        transactionInfoHtml += '<button class="add-btn" id="addBtn"><i class="add-icon uil uil-plus"></i>Return</button>';
                        transactionInfoHtml += '</div>';
                    });
                });
            }
            else if (type === 'device') {
                connection.query('SELECT book_movie_title_model, director_brand, image_address FROM catalog_view WHERE asset_id = (?)', [item_id], (deviceErr, results) => {
                    if (deviceErr) {
                        console.error('Error getting device item:', deviceErr);
                    }
                    results.forEach(device => {
                        transactionInfoHtml += `<img src="${device.image_address}">`;
                        transactionInfoHtml += '<div class="info">';
                        transactionInfoHtml += `<h3 id="model">${device.book_movie_title_model}</h3>`;
                        transactionInfoHtml += `<p>Brand: <span id="brand">${device.director_brand}</span></p>`;
                        transactionInfoHtml += `<p>Type: <span id="medium">${type}</span></p>`;
                        transactionInfoHtml += `<p>Device ID: <span id="item_id">${item_id}</span></p>`;
                        transactionInfoHtml += '</div></div>';
                        transactionInfoHtml += '<button class="add-btn" id="addBtn"><i class="add-icon uil uil-plus"></i>Return</button>';
                        transactionInfoHtml += '</div>';
                    });
                });
            }

        });
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(transactionInfoHtml, 'utf-8');
    });
}

module.exports = { getTransactionItems };

