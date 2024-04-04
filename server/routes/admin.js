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


request.on('end', () => {
    const formData = new URLSearchParams(body);

    const staffID = formData.get('staffID');
    const username = formData.get('username');
    const password = formData.get('password');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const staffPosition = formData.get('staffPosition');
    const employmentStatus = formData.get('employmentStatus');
    const supervisor = formData.get('supervisor');
    const phoneNumber = formData.get('phoneNumber');
    const email = formData.get('email');

    const sql = `
        INSERT INTO staff 
        (staffID, username, password, firstName, lastName, staffPosition, employmentStatus, supervisor, phoneNumber, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [staffID, username, password, firstName, lastName, staffPosition, employmentStatus, supervisor, phoneNumber, email];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            response.writeHead(500);
            response.end('Error saving data');
        } else {
            console.log('Data inserted into MySQL');
            response.writeHead(200);
            response.end('Data saved successfully');
        }
    });
});
