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



function verifyPassword(receivedHashedPassword, storedHashedPassword) {
    // Compare the received hashed password with the stored one
    return receivedHashedPassword === storedHashedPassword;
}

// user login function
/*function loginUser(response, username, password) {
   
    const query = "SELECT member_username, member_password FROM member_credentials WHERE" +
                  "member_username = ? AND member_password = ?";

                  link.query(query, [username, password], (err, results) => {
                    if (err) {
                        console.error('Database error', err);
                        response.writeHead(500); // HTTP status code 500: Internal Server Error
                        response.end('Server error');
                        return;
                    }
            
                    // Check if any results were returned
                    if (results.length > 0) {
                        // User found, proceed with login
                        console.log('User found:', results[0].member_username);
                        response.writeHead(200); // HTTP status code 200: OK
                        response.end('Login successful');
                    } else {
                        // No user found with the provided username and password
                        console.log('Login failed: User not found or password incorrect');
                        response.writeHead(401); // HTTP status code 401: Unauthorized
                        response.end('Login failed');
                    }
                });
}*/

/*function loginUser(res, username, password) {
    // Perform authentication logic here using the provided username and password
    // Example:
    console.log('Here');
    if (username === 'test@user.com' && password === 'password') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Login successful' }));
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
    }
}*/



//Added code here
//This is the function being used now
function loginUser(response, email, password, isStaff) {
    memberAccQuery = 'SELECT * FROM member_credentials WHERE member_email = ? AND member_password = ?';
    memberLbrQuery = 'SELECT * FROM member WHERE email = ? AND password = ?';
    staffAccQuery = 'SELECT * FROM staff_credentials WHERE staff_email = ? AND staff_password = ?';
    staffLbrQuery = 'SELECT * FROM staff WHERE email = ? AND password = ?';

    if (isStaff === false) {
        accessLink.query(memberAccQuery, [email, password], (memberErr, result) => {
            if (memberErr) {
                console.log('Error getting member:', memberErr);
            }
            else {
                if (result.length > 0) {
                    librLink.query(memberLbrQuery, [email, password], (regMemErr, lbrResult) => {
                        const memberId = lbrResult[0].member_id;
                        console.log(memberId);
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ memberId }));
                    });
                }
                else {
                    response.writeHead(409, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'User not found' }));
                }
            }
        });
    }
    else {
        accessLink.query(staffAccQuery, [email, password], (staffErr, result) => {
            if (staffErr) {
                console.log('Error getting staff:', memberErr);
            }
            else {
                if (result.length > 0) {
                    librLink.query(staffLbrQuery, [email, password], (regStaffErr, lbrResult) => {
                        const staffId = lbrResult[0].staff_id;
                        const staff_pos = lbrResult[0].staff_position;
                        let isAdmin;
                        if (staff_pos === 'admin') {
                            isAdmin = true;
                        }
                        else {
                            isAdmin = false;
                        }
                        
                        console.log(staffId);
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ staffId, isAdmin }));
                    });
                }
                else {
                    response.writeHead(409, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'User not found' }));
                }
            }
        });
    }
}



/*
function getUserStoredPassword(username) {

    return 'd033e22ae348aeb5660fc2140aec35850c4da997';
}*/




module.exports = { loginUser };