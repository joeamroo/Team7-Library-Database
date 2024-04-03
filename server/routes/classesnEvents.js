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


function createEventHtml(item) {
    let eventHtml = '';
    eventHtml += '<div class="event-item">'
    eventHtml += `<img src="${item.event_img}">`;
    eventHtml += `<h3><strong><span id="event-title">${item.event_title}</span></strong></h3>`;
    eventHtml += `<p><strong>Date:</strong> <span id="date">${item.date}</span></p>`;
    eventHtml += `<p><strong>Time:</strong> <span id="time">${item.start_time}-${item.end_time} ${item.morning_or_afternoon}</span></p>`;
    eventHtml += `<p><strong>Sponsor:</strong> <span id="sponsor">${item.sponsor}</span></p>`;
    eventHtml += `<p><strong>Description:</strong> ${item.event_description}</p>`;
    eventHtml += '<button class="signup-button">Sign Up</button>';    
    eventHtml += `</div>`;
    return eventHtml;
}

function getListedEvents(response) {
    connection.query('SELECT * FROM event', (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }
        
        results.forEach(item => { createEventHtml(item) });
        
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(catalogHtml, 'utf-8');
    });
}


module.exports = { getListedEvents };