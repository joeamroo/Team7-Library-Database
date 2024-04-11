const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function createBookItemHtml(item) {
    let itemHtml = '';
    itemHtml += '<tr id="catalog-item">';
    itemHtml += `<td id="item_id">${item.isbn}</td>`;
    itemHtml += `<td id="item_type">${capitalizeFirstLetter(item.asset_type)}</td>`;
    itemHtml += `<td id="item_condition">${item.asset_condition}</td>`;
    itemHtml += `<td id="item_holds">${item.current_holds}</td>`;
    itemHtml += `<td id="item_total_copies">${item.total_copies}</td>`
    itemHtml += '</tr>';
    return itemHtml;
}

function createMovieDeviceItemHtml(item) {
    let itemHtml = '';
    itemHtml += '<tr id="catalog-item">';
    itemHtml += `<td id="item_id">${item.asset_id}</td>`;
    itemHtml += `<td id="item_type">${capitalizeFirstLetter(item.asset_type)}</td>`;
    itemHtml += `<td id="item_condition">${item.asset_condition}</td>`;
    itemHtml += `<td id="item_holds">${item.current_holds}</td>`;
    itemHtml += `<td id="item_total_copies">${item.total_copies}</td>`
    itemHtml += '</tr>';
    return itemHtml;
}


function getItemsForAdmin(res) {
    connection.query('SELECT asset_type, isbn, asset_id, asset_condition, current_holds, total_copies FROM catalog_view', (err, results) => {
        if (err) {
            console.error('Error querying staff data:', err);
            res.writeHead(500);
            res.end('Server error');
            return;
        }

        let itemHtml = '';
        results.forEach(item => { 
            if (item.asset_type === 'book') {
                itemHtml += createBookItemHtml(item);
            }
            else if (item.asset_type === 'movie' || item.asset_type === 'device') {
                itemHtml += createMovieDeviceItemHtml(item);
            }
        });
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(itemHtml, 'utf-8');
    });
}

function filterCatalogItems(res, itemType, itemCondition, checkoutDate) {
    let searchQuery = `SELECT cv.asset_type, cv.isbn, cv.asset_id, cv.asset_condition, cv.current_holds, cv.total_copies FROM catalog_view cv JOIN transaction_view tv ON ((cv.asset_type = 'book' AND cv.isbn = tv.item_id) OR (cv.asset_type IN ('movie', 'device') AND cv.asset_id = tv.item_id)) JOIN transaction t ON tv.transaction_id = t.transaction_id WHERE `;
  
    const queryParams = [];
  
    if (itemType !== '') {
      searchQuery += 'cv.asset_type = ? ';
      queryParams.push(itemType);
    }
  
    if (itemCondition !== '') {
      searchQuery += (queryParams.length > 0 ? 'AND ' : '') + 'cv.asset_condition = ? ';
      queryParams.push(itemCondition);
    }
  
    if (checkoutDate !== '' && checkoutDate != null) {
      searchQuery += (queryParams.length > 0 ? 'AND ' : '') + 'DATE(t.date_created) = ? ';
      queryParams.push(checkoutDate);
    }
  
    connection.query(searchQuery, queryParams, (err, results) => {
      if (err) {
        console.error('Error querying data:', err);
        res.writeHead(500);
        res.end('Server error');
        return;
      }
  
      let itemHtml = '';
      results.forEach(item => {
        if (item.asset_type === 'book') {
          itemHtml += createBookItemHtml(item);
        } 
        else if (item.asset_type === 'movie' || item.asset_type === 'device') {
          itemHtml += createMovieDeviceItemHtml(item);
        }
      });
  
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(itemHtml, 'utf-8');
    });
  }


module.exports = { getItemsForAdmin, filterCatalogItems };