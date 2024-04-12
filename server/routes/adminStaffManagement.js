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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createStaffHtml(item) {
    let staffHtml = '';
    staffHtml += '<tr class="employee-item">';
    staffHtml += `<td class="staff_id">${item.staff_id}</td>`;
    staffHtml += `<td class="staff_name">${item.name}</td>`;
    staffHtml += `<td class="staff_email">${item.email}</td>`;
    staffHtml += `<td class="staff_position">${capitalizeFirstLetter(item.staff_position)}</td>`;
    staffHtml += `<td id="supervisor">${item.supervisor}</td>`;
    staffHtml += `<td class="staff_empl_status">${capitalizeFirstLetter(item.employment_status)}</td>`;
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


function filterStaff(res, empStatus, empPos) {
    filterQuery = 'SELECT staff_id, name, email, staff_position, supervisor, employment_status FROM staff WHERE ';

    const queryParams = [];

    if (empStatus !== '') {
        filterQuery += 'employment_status = ? ';
        queryParams.push(empStatus);
    }

    if (empPos !== '') {
        filterQuery += (queryParams.length > 0 ? 'AND ' : '') + 'staff_position = ? ';
        queryParams.push(empPos);
    }

    if (queryParams.length === 0) {
        filterQuery = 'SELECT staff_id, name, email, staff_position, supervisor, employment_status FROM staff';
    }


    connection.query(filterQuery, queryParams, (filterErr, results) => {
        if (filterErr) {
            console.error('Error querying staff data:', filterErr);
            res.writeHead(500);
            res.end('Server error');
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