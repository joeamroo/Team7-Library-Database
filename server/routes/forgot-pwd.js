const mysql = require('mysql');

const librLink = mysql.createConnection({
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



function resetPassword(res, user_id, email, new_password) {
    newPasswordLibrMember = 'UPDATE member SET password = ? WHERE member_id = ? AND email = ?';
    newPasswordLibrStaff = 'UPDATE staff SET password = ? WHERE staff_id = ? AND email = ?';
    newPasswordAccessMember = 'UPDATE member_credentials SET member_password = ? WHERE member_email = ?';
    newPasswordAccessStaff = 'UPDATE staff_credentials SET staff_password = ? WHERE staff_email = ?';

    librLink.query('SELECT * FROM member WHERE member_id = ? and email = ?', [user_id, email], (err, result) => {
        if (err) {
            console.log('Error accessing member table in librarydev:', err);
        }
        if (result.length > 0) {
            librLink.query(newPasswordLibrMember, [new_password, user_id, email]);
            accessLink.query(newPasswordAccessMember, [new_password, email]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'passwordResetSuccessful' }));
        }
        else {
            librLink.query('SELECT * FROM staff WHERE staff_id AND email = ?', [user_id, email], (err, result) => {
                if (err) {
                    console.log('Error accessing staff table:', err);
                }
                if (result.length > 0) {
                    librLink.query(newPasswordLibrStaff, [new_password, user_id, email]);
                    accessLink.query(newPasswordAccessStaff, [new_password, email]);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'passwordResetSuccessful' }));
                }
                else {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'userNotFound' }));
                }
            });
        }
    });
}


module.exports = { resetPassword };