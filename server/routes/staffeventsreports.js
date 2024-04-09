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


// get the attendance and signups of this event
function getEventAttendance(response) {
    connection.query('SELECT * FROM staff_reports', (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let reportsHtml = '';
        
        results.forEach(item => { reportsHtml += createReportHtml(item); });
        
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(reportsHtml, 'utf-8');
    });

}
// Get the attendance of other events, averaged.
function otherEventsAttendance(response) {
    connection.query('SELECT * FROM staff_reports', (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let reportsHtml = '';
        
        results.forEach(item => { reportsHtml += createReportHtml(item); });
        
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(reportsHtml, 'utf-8');
    });


}
// main report to be sent to the staff
function getEventReports(response) {
    connection.query('SELECT * FROM staff_reports', (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let reportsHtml = '';
        
        results.forEach(item => { reportsHtml += createReportHtml(item); });
        
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(reportsHtml, 'utf-8');
    });
}