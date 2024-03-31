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

function createBookItem(item) {
    let bookHtml = '';
    bookHtml += `<img src="${item.image_address}">`;
    bookHtml += `<div class="info">`;
    bookHtml += `<h3 id = "title">${item.book_movie_title_model}</h3>`;
    bookHtml += `<p id="author-place">by <span id="author">${item.authors}</span></p>`;
    bookHtml += `<p>Type: <span id="medium">Book</span></p>`;
    bookHtml += `<p>ISBN <span id="isbn">${item.isbn}</span></p>`;
    bookHtml += `<p id="year-place">Year Published: <span id="yearPub">${item.year_released}</span></p>`;
    bookHtml += `<p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>`;
    bookHtml += `<p>System availability: <span id="availableItems"><span id="currAvail">${item.available_copies}</span> (of ${item.total_copies})</span></p>`;
    bookHtml += `</div>`;
    return bookHtml;
}

function createMovieItem(item) {
    let movieHtml = '';
    movieHtml += `<img src="${item.image_address}">`;
    movieHtml += `<div class="info">`;
    movieHtml += `<h3 id = "title">${item.book_movie_title_model}</h3>`;
    movieHtml += `<p id="director-place">Director: <span id="director">${item.director_brand}</span></p>`;
    movieHtml += `<p>ID: <span id="mov_asset_id">${item.asset_id}</span></p>`;
    movieHtml += `<p>Type: <span id="medium">Movie</span></p>`;
    movieHtml += `<p>Rating: <span id="rating">${item.rating}</span></p>`;
    movieHtml += `<p id="year-place">Year Released: <span id="yearPub">${item.year_released}</span></p>`;
    movieHtml += `<p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>`;
    movieHtml += `<p>System availability: <span id="availableItems"><span id="currAvail">${item.available_copies}</span> (of <span id="totalAvail">${item.total_copies}</span>)</span></p>`;
    movieHtml += `</div>`;
    return movieHtml;
}

function createDeviceItem(item) {
    let deviceHtml = '';
    deviceHtml += `<img src="${item.image_address}">`;
    deviceHtml += `<div class="info">`;
    deviceHtml += `<h3 id = "title">${item.book_movie_title_model}</h3>`;
    deviceHtml += `<p id="brand-place">by <span id="director">${item.director_brand}</span></p>`;
    deviceHtml += `<p>ID: <span id="dev_asset_id">${item.asset_id}</span></p>`;
    deviceHtml += `<p>Type: <span id="medium">Device</span></p>`;
    deviceHtml += `<p>Serial number: <span id="serial-num">${item.serial_number}</span></p>`;
    deviceHtml += `<p id="cond-place">Condition: <span id="condition">${item.asset_condition}</span></p>`;
    deviceHtml += `<p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>`;
    deviceHtml += `<p>System availability: <span id="availableItems"><span id="currAvail">${item.available_copies}</span> (of <span id="totalAvail">${item.total_copies}</span>)</span></p>`;
    deviceHtml += `</div>`;
    return deviceHtml;
}

function getInitialCatalogInfo(response) {
    const query = 'SELECT * FROM catalog_view';

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
                catalogHtml += createBookItem(item);
            }
            else if (item.asset_type === `movie`) {
                catalogHtml += createMovieItem(item);
            }
            else if (item.asset_type === `device`) {
                catalogHtml += createDeviceItem(item);
            }
            catalogHtml += `</div>`;
            catalogHtml += `<div class="item-buttons">`;
            catalogHtml += `<button class="hold-btn">Place Hold</button>`;
            catalogHtml += `<button class="checkout-btn">Add to Checkout</button>`;
            catalogHtml += `</div>`;
            catalogHtml += `</div>`;
        });

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(catalogHtml, 'utf-8');
    });
}

function getCatalogSearchWithRestrictions(response, keyword, searchBy, limitBy, availability, genres, langs, years, brands) {

    let query = 'SELECT * FROM catalog_view WHERE ';

    if (searchBy === 'any') {
        query += `(book_movie_title_model LIKE '%${keyword}%' OR authors LIKE '%${keyword}%' OR director_brand LIKE '%${keyword}%')`;
    } 
    else {
        switch (searchBy) {
            case 'title':
                query += `book_movie_title_model LIKE '%${keyword}%'`;
                break;
            case 'author':
                query += `authors LIKE '%${keyword}%'`;
                break;
            case 'director':
                query += `director_brand LIKE '%${keyword}%'`;
                break;
            case 'brand':
                query += `director_brand LIKE '%${keyword}%'`;
                break;
        }
    }

    if (availability === 'on') {
        query += ' AND available_copies > 0';
    }

    if (genres && Array.isArray(genres) && genres.length > 0) {
        const genresCondition = genres.map(genre => `genres LIKE '%${genre}%'`).join(' OR ');
        query += ` AND (${genresCondition})`;
    }

    if (langs && Array.isArray(langs) && langs.length > 0) {
        const langsCond = langs.map(language => `languages LIKE '%${language}%'`).join(' OR ');
        query += ` AND (${langsCond})`;
    }

    if (years && Array.isArray(years) && years.length > 0) {
        const yearsCond = years.map(year => `year_released LIKE '%${year}%'`).join(' OR ');
        query += ` AND (${yearsCond})`;
    }

    if (brands && Array.isArray(brands) && brands.length > 0) {
        const brandsCond = brands.map(brand => `director_brand LIKE '%${brand}%'`).join(' OR ');
        query += ` AND (${brandsCond})`;
    }

    if (limitBy && limitBy !== 'unlimited') {
        query += ` AND asset_type = '${limitBy}'`;
    }

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
                catalogHtml += createBookItem(item);
            }
            else if (item.asset_type === `movie`) {
                catalogHtml += createMovieItem(item);
            }
            else if (item.asset_type === `device`) {
                catalogHtml += createDeviceItem(item);
            }
            catalogHtml += `</div>`;
            catalogHtml += `<div class="item-buttons">`;
            catalogHtml += `<button class="hold-btn">Place Hold</button>`;
            catalogHtml += `<button class="checkout-btn">Add to Checkout</button>`;
            catalogHtml += `</div>`;
            catalogHtml += `</div>`;
        });

        if (catalogHtml === '') {
            catalogHtml = '<div class="no-results">Sorry, no items found for your search.</div>';
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(catalogHtml, 'utf-8');
    });
}

function insertDataToDatabase(response, itemTitle) {
    const getInfo = 'SELECT asset_type, isbn, asset_id from catalog_view where book_movie_title_model = ?';
    // I have specified the member but need to change to use member logged in !!!!!
    const member_id = 1002001;

    connection.query(getInfo, [itemTitle], (err, results) => {
        const { asset_type, isbn, asset_id } = results[0];

        let insertQuery;
        let updateHoldQuery;
        let values;
        let updValues;

        if (asset_type === 'book') {
            insertQuery = 'INSERT INTO hold_request (member_id, item_name, isbn, status, request_date) VALUES (?, ?, ?, ?, NOW())';
            values = [member_id, itemTitle, isbn, 'active'];

            updateHoldQuery = 'UPDATE book SET current_holds = current_holds + 1 WHERE isbn = ?';
            updValues = [isbn];
        } 
        else if (asset_type === 'movie') {
            insertQuery = 'INSERT INTO hold_request (member_id, item_name, movie_id, request_date) VALUES (?, ?, ?, ?, NOW())';
            values = [member_id, itemTitle, asset_id, 'active'];

            updateHoldQuery = 'UPDATE movie SET current_holds = current_holds + 1 WHERE movie_id = ?';
            updValues = [asset_id];
        }
        else if (asset_type === 'device') {
            insertQuery = 'INSERT INTO hold_request (member_id, item_name, device_id, request_date) VALUES (?, ?, ?, ?, NOW())';
            values = [member_id, itemTitle, asset_id, 'active'];

            updateHoldQuery = 'UPDATE device SET current_holds = current_holds + 1 WHERE device_id = ?';
            updValues = [asset_id];
        }

        connection.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error inserting data into other table:', err);
                response.writeHead(500);
                response.end('Server error');
                return;
            }

            if (result) {
                connection.query(updateHoldQuery, updValues, (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating current_holds:', updateErr);
                    }
                    else {
                        console.log('Current holds updated successfully');
                    }
                });
            }
            response.writeHead(200);
            console.log('Data inserted into other table successfully');
        });
    });
}

function getCurrentHolds(response, medium, itemId) {
    let query;
    if (medium === 'book') {
        query = 'SELECT current_holds FROM catalog_view WHERE asset_type = ? AND isbn = ?';
    }
    else if (medium === 'movie' || medium === 'device') {
        query = 'SELECT current_holds FROM catalog_view WHERE asset_type = ? AND asset_id = ?';
    }

    connection.query(query, [medium,itemId], (error, results) => {
        if (error) {
            console.error('Error getting current holds from view:', error);
            response.writeHead(500);
            response.end('Server error');
        }
        else {
            if (results.length > 0) {
                const currentHolds = results[0].current_holds;
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(currentHolds));
            }
            else {
                response.statusCode = 404;
                response.end('No data found');
            }
        }
    });
}

module.exports = { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase, getCurrentHolds };