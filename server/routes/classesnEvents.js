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
    const formattedDate = formatDate(item.date);
    let eventHtml = '';
    eventHtml += '<div class="toast-container" id="toastContainer"></div>';
    eventHtml += '<div class="event-item">'
    eventHtml += '<div class="info">';
    eventHtml += `<img src=${item.event_img}>`;
    eventHtml += `<p id="eventId" style="display: none;">${item.event_id}</p>`;
    eventHtml += `<h3><strong><span id="event-title">${item.event_name}</span></strong></h3>`;
    eventHtml += `<p><strong>Date:</strong> <span id="date">${formattedDate}</span></p>`;
    eventHtml += `<p><strong>Time:</strong> <span id="time">${item.start_time} ${item.startAMPM} - ${item.end_time} ${item.endAMPM}</span></p>`;
    eventHtml += `<p><strong>Sponsor:</strong> <span id="sponsor">${item.sponsor}</span></p>`;
    eventHtml += `<p><strong>Description:</strong> ${item.event_description}</p>`;
    eventHtml += '<button class="signup-button">Sign Up</button>';    
    eventHtml += `</div></div>`;
    return eventHtml;
}

function formatDate(dateString) {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getListedEvents(response) {
    connection.query(`SELECT * FROM event WHERE event_status = 'active' ORDER BY date`, (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let eventsHtml = '';
        
        results.forEach(item => { eventsHtml += createEventHtml(item); });
        
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(eventsHtml, 'utf-8');
    });
}

function eventSignUp(response, eventId, memberId) {
    checkSignUpExistenceQuery = 'select count(*) as count from events_member_link where event_id = ? and member_id = ?';
    addSignUpQuery = 'insert into events_member_link (event_id, member_id) values (?, ?)';
    updateAttendanceQuery = 'update event set attendance_count = attendance_count + 1 where event_id = ?';

    connection.query(checkSignUpExistenceQuery, [eventId, memberId], (checkErr, checkResult) => {
        if (checkErr) {
            console.log('Error checking events_member_link:', checkErr);
        }
        else {
            const count = checkResult[0].count;
            if (count > 0) {
                console.log('User is already registered for this event');
                response.writeHead(409, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'alreadyRegistered' }));
            }
            else {
                connection.query(addSignUpQuery, [eventId, memberId], (err, result) => {
                    if (err) {
                        console.log('Error inserting into bridge table:', err);
                    }
                    if (result) {
                        connection.query(updateAttendanceQuery, [eventId], (updErr, result) => {
                            if(updErr) {
                                console.log('Error updating attendance count:', updErr);
                            }
                            else {
                                response.writeHead(200, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify({ message: 'signUpSuccessful' }));
                            }
                        });
                    }
                });
            }
        }
    });
}

module.exports = { getListedEvents, eventSignUp };