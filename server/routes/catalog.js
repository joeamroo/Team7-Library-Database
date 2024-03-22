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
    const query = 'SELECT * FROM catalog_view LIMIT 4';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let catalogHtml = '';

        results.forEach(item => {
            catalogHtml += `<div class="catalog-item">`;

            catalogHtml += `<div class="catalog-item-info">`;
            if (item.asset_type === `book`) {
                catalogHtml += `<img src="https://m.media-amazon.com/images/I/318nujF5v5L._SY445_SX342_.jpg">`;
                catalogHtml += `<div class="info">`;
                catalogHtml += `<h3 id = "title">${item.book_movie_title_model}</h3>`;
                catalogHtml += `<p id="author-place">by <span id="author">${item.authors}</span></p>`;
                catalogHtml += `<p>Type: <span id="medium">Book</span></p>`;
                catalogHtml += `<p>ISBN <span id="isbn">${item.isbn}</span></p>`;
                catalogHtml += `<p id="year-place">Year Published: <span id="yearPub">${item.year_released}</span></p>`;
                catalogHtml += `<p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>`;
                catalogHtml += `<p>System availability: <span id="availableItems">${item.available_copies} (of ${item.total_copies})</span></p>`;
                catalogHtml += `</div>`;
            }
            else if (item.asset_type === `movie`) {
                catalogHtml += `<img src="${item.image_address}">`;
                catalogHtml += `<div class="info">`;
                catalogHtml += `<h3 id = "title">${item.book_movie_title_model}</h3>`;
                catalogHtml += `<p id="director-place">by <span id="director">${item.director_brand}</span></p>`;
                catalogHtml += `<p>Type: <span id="medium">Movie</span></p>`;
                catalogHtml += `<p>Rating: <span id="rating">${item.rating}</span></p>`;
                catalogHtml += `<p id="year-place">Year Released: <span id="yearPub">${item.year_released}</span></p>`;
                catalogHtml += `<p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>`;
                catalogHtml += `<p>System availability: <span id="availableItems">${item.available_copies} (of ${item.total_copies})</span></p>`;
                catalogHtml += `</div>`;
            }
            else if (item.asset_type === `device`) {
                catalogHtml += `<img src="${item.image_address}">`;
                catalogHtml += `<div class="info">`;
                catalogHtml += `<h3 id = "title">${item.book_movie_title_model}</h3>`;
                catalogHtml += `<p id="brand-place">by <span id="director">${item.director_brand}</span></p>`;
                catalogHtml += `<p>Type: <span id="medium">Device</span></p>`;
                catalogHtml += `<p>Serial number: <span id="serial-num">${item.serial_number}</span></p>`;
                catalogHtml += `<p id="cond-place">Condition: <span id="condition">${item.asset_condition}</span></p>`;
                catalogHtml += `<p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>`;
                catalogHtml += `<p>System availability: <span id="availableItems">${item.available_copies} (of ${item.total_copies})</span></p>`;
                catalogHtml += `</div>`;
            }
            catalogHtml += `</div>`;
            catalogHtml += `<div class="item-buttons">`;
            catalogHtml += `<button class="hold-btn">Place Hold</button>`;
            catalogHtml += `<button class="checkout-btn">Add to Checkout</button>`;
            catalogHtml += `</div>`;
            catalogHtml += `</div>`;
        });

        const initialCatalogHtml = fs.readFileSync('./front-end/catalog/catalog.html', 'utf8');
        const finalHtml = initialCatalogHtml.replace('<!--Catalog items-->', catalogHtml);

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(finalHtml, 'utf-8');
    });
}

module.exports = { getInitialCatalogInfo };