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
    console.log('Connected to LibraryDev database - admin');
});

function createStaffHtml(item) {
    let staffHtml = '';
    staffHtml += '<tr id="employee-item">';
    staffHtml += `<td id="staff_id">${item.staff_id}</td>`;
    staffHtml += `<td id="staff_name">${item.name}</td>`;
    staffHtml += `<td id="staff_position">${item.staff_position}</td>`;
    staffHtml += `<td id="supervisor">${item.supervisor}</td>`;
    staffHtml += `<td id="staff_empl_status">${item.employment_status}</td>`;
    staffHtml += '</tr>';
    return staffHtml;
}

function getEmployees(res) {
    connection.query('SELECT staff_id, name, staff_position, supervisor, employment_status  FROM staff', (err, results) => {
        if (err) {
            console.error('Error querying catalog data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let staffHtml = '';
        
        results.forEach(item => { staffHtml += createStaffHtml(item); });
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(staffHtml, 'utf-8');
    });

}


module.exports = { getEmployees }