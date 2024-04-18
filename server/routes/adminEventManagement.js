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

function createEventHtml(item) {
    let eventHtml = '';
    eventHtml += '<tr class="event-item">';
    eventHtml += `<td class="event_id">${item.event_id}</td>`;
    eventHtml += `<td id="event_name">${item.event_name}</td>`;
    eventHtml += `<td id="event_date">${item.date}</td>`;
    eventHtml += `<td id="event_type">${item.event_type}</td>`;
    eventHtml += `<td id="sponsor">${item.sponsor}</td>`;
    eventHtml += `<td id="attendance">${item.attendance_count}</td>`;
    eventHtml += `<td id="event_status">${capitalizeFirstLetter(item.event_status)}</td>`;
    eventHtml += '</tr>';
    return eventHtml;
}

function createAlertHtml(item) {
    let alertHtml = '';
    alertHtml += `<ul class="trigEvent">ID: ${item.event_id}</ul>`;
    return alertHtml;
}

function getAdminAlerts(res) {
    connection.query(`SELECT event_id FROM event_alerts_for_admin WHERE alert_status = 'active' ORDER BY event_id ASC`, (err, results) => {
        if (err) {
            console.error('Error getting admin alerts data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let alertHtml = '';

        if (results.length > 0) {
            results.forEach(item => { alertHtml += createAlertHtml(item); });
        }
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(alertHtml, 'utf-8');
    });
}

function getEventsForAdmin(res) {
    connection.query('SELECT event_id, event_name, date, sponsor, attendance_count, event_status, event_type FROM event ORDER BY event_id ASC', (err, results) => {
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

function insertEvent(res, name, des, img, sponsor, date, normalizedStartTime, stPeriod, normalizedEndTime, endPeriod) {
    connection.query(`INSERT INTO event (event_name, event_description, event_img, date, start_time, startAMPM, end_time, endAMPM, event_status, sponsor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [name, des, img, date, normalizedStartTime, stPeriod, normalizedEndTime, endPeriod, 'active', sponsor ], (newEventErr, result) => {
        if (newEventErr) {
            console.log('error entering new event into librarydev db:', newEventErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'eventCreationSuccessful' }));
}

function deleteEvent(res, eventId) {
    connection.query(`UPDATE event SET event_status = 'ended' WHERE event_id = ?`, [eventId], (removeEventErr, result) => {
        if (removeEventErr) {
            console.log('error changing event status:', removeEventErr);
        }
    });

    connection.query(`UPDATE event_alerts_for_admin SET alert_status = 'closed' WHERE event_id = ?`, [eventId], (closeAlertErr, result) => {
        if (closeAlertErr) {
            console.log('error changing admin alert status:', removeEventErr);
        }
    });  

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'eventDeletionSuccessful' }));
}

function filterEvents(res, startDate, endDate, sponsor, memType, time) {
    let searchQuery = 'SELECT DISTINCT e.* FROM event e INNER JOIN events_member_link eml ON e.event_id = eml.event_id INNER JOIN member m ON eml.member_id = m.member_id WHERE (e.date BETWEEN ? AND ?)';
  
    const queryParams = [startDate, endDate];
  
    if (sponsor !== '') {
      searchQuery += 'AND e.sponsor = ? ';
      queryParams.push(sponsor);
    }
  
    if (memType !== '') {
      searchQuery += (queryParams.length > 0 ? ' AND ' : '') + 'm.mem_type = ? ';
      queryParams.push(memType);
    }
  
    if (time !== '' && time != null) {
        if (time === 'morning') {
            searchQuery += (queryParams.length > 0 ? ' AND ' : '') + `e.start_time < 12 AND e.startAMPM ='AM'`;
        }
        else if (time === 'afternoon') {
            searchQuery += (queryParams.length > 0 ? ' AND ' : '') + `e.start_time >= 12 AND e.startAMPM ='PM' AND e.start_time < 5`;
        }
        else if (time === 'evening') {
            searchQuery += (queryParams.length > 0 ? ' AND ' : '') + `e.start_time >= 5 AND e.startAMPM ='PM'`;
        }
    }

    searchQuery += ' ORDER BY date ASC';
  
    connection.query(searchQuery, queryParams, (err, results) => {
      if (err) {
        console.error('Error filtering event report data:', err);
        res.writeHead(500);
        res.end('Server error');
        return;
      }
  
      let eventHtml = '';
      
      results.forEach(item => { eventHtml += createEventHtml(item); });
        
  
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(eventHtml, 'utf-8');
    });
}


module.exports = { getAdminAlerts, getEventsForAdmin, insertEvent, deleteEvent, filterEvents };