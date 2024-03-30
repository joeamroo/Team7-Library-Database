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
            let title_model;
            let author_director_brand;
            let type = item.asset_type;
            let item_id = item.itemId;
            let img;

            transactionInfoHtml += '<div class="transac-item"><div class="catalog-item-info>';

            if (item.asset_type === 'book') {
                connection.query('SELECT book_movie_title_model, authors, image_address FROM catalog_view WHERE isbn = (?)', [item_id], (bookErr, results) => {
                    if (bookErr) {
                        console.error('Error getting book item:', bookErr);
                    }
                    author_director_brand = results[0].authors;
                    console.log(author_director_brand);
                    title_model = results[0].title;
                    console.log(title_model);
                    img = results[0].img_address
                    console.log(img);
                });
                transactionInfoHtml += `<img src="${img}">`;
                transactionInfoHtml += '<div class="info">';
                transactionInfoHtml += `<h3 id="btitle">${title_model}</h3>`;
                transactionInfoHtml += `<p>Author: <span id="author">${author_director_brand}</span></p>`;
                transactionInfoHtml += `<p>Type: <span id="medium">${type}</span></p>`;
                transactionInfoHtml += `<p>ISBN: <span id="isbn">${item_id}</span></p>`;
            }
            else if (item.asset_type === 'movie') {
                connection.query('SELECT book_movie_title_model, director_brand, image_address FROM catalog_view WHERE asset_id = (?)', [item_id], (movieErr, results) => {
                    if (movieErr) {
                        console.error('Error getting movie item:', movieErr);
                    }
                    author_director_brand = results[0].director_brand;
                    title_model = results[0].title;
                    img = results[0].img_address
                });
                transactionInfoHtml += `<img src="${img}">`;
                transactionInfoHtml += '<div class="info">';
                transactionInfoHtml += `<h3 id="mtitle">${title_model}</h3>`;
                transactionInfoHtml += `<p>Director: <span id="director">${author_director_brand}</span></p>`;
                transactionInfoHtml += `<p>Type: <span id="medium">${type}</span></p>`;
                transactionInfoHtml += `<p>Movie ID: <span id="isbn">${item_id}</span></p>`;
            }
            else if (item.asset_type === 'device') {
                connection.query('SELECT book_movie_title_model, director_brand, image_address FROM catalog_view WHERE asset_id = (?)', [item_id], (deviceErr, results) => {
                    if (deviceErr) {
                        console.error('Error getting device item:', deviceErr);
                    }
                    author_director_brand = results[0].director_brand;
                    title_model = results[0].title;
                    img = results[0].img_address
                });
                transactionInfoHtml += `<img src="${img}">`;
                transactionInfoHtml += '<div class="info">';
                transactionInfoHtml += `<h3 id="model">${title_model}</h3>`;
                transactionInfoHtml += `<p>Brand: <span id="director">${author_director_brand}</span></p>`;
                transactionInfoHtml += `<p>Type: <span id="medium">${type}</span></p>`;
                transactionInfoHtml += `<p>Device ID: <span id="isbn">${item_id}</span></p>`;
            }

            transactionInfoHtml += '</div></div>';
            transactionInfoHtml += '<button class="add-btn" id="addBtn"><i class="add-icon uil uil-plus"></i>Return</button>';
            transactionInfoHtml += '</div>';
        });

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(transactionInfoHtml, 'utf-8');
    });
}

module.exports = { getTransactionItems };

