const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function createEventHtml(item) {
    let eventHtml = '';
    eventHtml += '<tr id="event-item">';
    eventHtml += `<td id="event_id">${item.event_id}</td>`;
    eventHtml += `<td id="event_name">${item.event_name}</td>`;
    eventHtml += `<td id="event_date">${item.date}</td>`;
    eventHtml += `<td id="sponsor">${item.sponsor}</td>`;
    eventHtml += `<td id="attendance">${item.attendance}</td>`;
    eventHtml += `<td id="event_status">${item.event_status}</td>`;
    eventHtml += '</tr>';
    return eventHtml;
}

function getEventsForAdmin(res) {
    connection.query('SELECT event_id, event_name, date, sponsor, attendance_count, event_status FROM event', (err, results) => {
        if (err) {
            console.error('Error querying staff data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let eventHtml = '';
        
        results.forEach(item => { eventHtml += createEventHtml(item); });
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(eventHtml, 'utf-8');
    });
}


module.exports = { getEventsForAdmin };