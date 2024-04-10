const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

const accessLink = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'access_control',
    port:3306
});


function createStaffHtml(item) {
    let staffHtml = '';
    staffHtml += '<tr id="employee-item">';
    staffHtml += `<td id="staff_id">${item.staff_id}</td>`;
    staffHtml += `<td id="staff_name">${item.name}</td>`;
    staffHtml += `<td id="staff_email">${item.email}</td>`;
    staffHtml += `<td id="staff_position">${item.staff_position.toUpperCase()}</td>`;
    staffHtml += `<td id="supervisor">${item.supervisor}</td>`;
    staffHtml += `<td id="staff_empl_status">${item.employment_status.toUpperCase()}</td>`;
    staffHtml += '</tr>';
    return staffHtml;
}

function getEmployees(res) {
    connection.query('SELECT staff_id, name, email, staff_position, supervisor, employment_status FROM staff', (err, results) => {
        if (err) {
            console.error('Error querying staff data:', err);
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

function insertStaff(res, name, phoneNum, email, password, supervisor, position) {
    let isAdmin;
    if (position === 'admin') {
        isAdmin = 'true';
    }
    else {
        isAdmin = 'false';
    }

    // insert into access control first
    accessLink.query('INSERT INTO staff_credentials (staff_password, staff_email, isAdmin) VALUES (?, ?, ?)', [password, email, isAdmin], (credentialErr, result) => {
        if (credentialErr) {
            console.log('error accessing access_control db table:', credentialErr);
        }
    });

    connection.query(`INSERT INTO staff (password, name, staff_position, employment_status, supervisor, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)`, [password, name, position, 'active', supervisor, phoneNum, email], (newMemErr, result) => {
        if (newMemErr) {
            console.log('error entering new member into librarydev db:', newMemErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'staffCreationSuccessful' }));
}

function removeStaff(res, email, staffId, empStatus) {
    // insert into access control first
    accessLink.query('DELETE FROM staff_credentials WHERE staff_email = ?', [email], (credentialErr, result) => {
        if (credentialErr) {
            console.log('error accessing access_control db table:', credentialErr);
        }
    });

    connection.query(`UPDATE staff SET date_removed = NOW(), employment_status = ? WHERE email = ? AND staff_id = ?`, [empStatus, email, staffId], (removeStaffErr, result) => {
        if (removeStaffErr) {
            console.log('error entering new member into librarydev db:', removeStaffErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'staffDeletionSuccessful' }));
}


function filterStaff(res, value, type) {
    let filterQuery;
    if (type === 'staff_position') {
        filterQuery = 'SELECT staff_id, name, email, staff_position, supervisor, employment_status FROM staff WHERE staff_position = ?';
    }
    else if (type === 'employment_status') {
        filterQuery = 'SELECT staff_id, name, email, staff_position, supervisor, employment_status FROM staff WHERE employment_status = ?';
    }

    connection.query(filterQuery, [value], (filterErr, results) => {
        if (filterErr) {
            console.error('Error querying staff data:', filterErr);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let staffHtml = '';
        if (results.length > 0) {
            results.forEach(item => { staffHtml += createStaffHtml(item); });
        }
        else {
            staffHtml = 'No Employees Found';
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(staffHtml, 'utf-8');
    });
}


module.exports = { getEmployees, insertStaff, removeStaff, filterStaff };