const mysql = require('mysql');
const Chart = require('chart.js');


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


// get the attendance of this event
function getEventAttendance(eventId, callback) {
    connection.query('SELECT attendance_count FROM event WHERE event_id = ?', [eventId], (err, results) => {
        if (err) {
            console.error('Could not find Event:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        if (results.length > 0) {
            const attendanceCount = results[0].attendance_count;
            callback(null, attendanceCount);
        } else {
            callback('Event not found', null);
        }
    });
}

// Function to get the average attendance of other events
function otherEventsAttendance(eventId, callback) {
    connection.query('SELECT AVG(attendance_count) AS average_attendance FROM event WHERE event_id != ?', [eventId], (err, results) => {
        if (err) {
            console.error('Error fetching average attendance of other events:', err);
            callback(err, null);
            return;
        }
        if (results.length > 0) {
            const averageAttendance = results[0].average_attendance;
            callback(null, averageAttendance);
        } else {
            callback('No other events found', null);
        }
    });
}

// Function to generate chart using Chart.js
function generateChart(eventAttendance, averageAttendance) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Event Attendance', 'Average Attendance'],
            datasets: [{
                label: 'Attendance',
                data: [eventAttendance, averageAttendance],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Main function to get event reports and generate chart
function getEventReports(eventId, response) {
    getEventAttendance(eventId, (err, eventAttendance) => {
        if (err) {
            console.error(err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        otherEventsAttendance(eventId, (err, averageAttendance) => {
            if (err) {
                console.error(err);
                response.writeHead(500);
                response.end('Server error');
                return;
            }

            // Generate chart using Chart.js
            generateChart(eventAttendance, averageAttendance);

            // Send response to client
            const responseData = {
                eventAttendance: eventAttendance,
                averageAttendance: averageAttendance
            };
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(responseData));
        });
    });
}

module.exports = { getEventReports };