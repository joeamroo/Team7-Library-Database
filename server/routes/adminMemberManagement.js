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
function createMemberHtml(item) {
    let memberHtml = '';
    memberHtml += '<tr class="member-item">';
    memberHtml += `<td class="member_id">${item.member_id}</td>`;
    memberHtml += `<td class="member_name">${item.name}</td>`;
    memberHtml += `<td class="member_email">${item.email}</td>`;
    memberHtml += `<td class="member_phone">${item.phone_number}</td>`;
    memberHtml += `<td id="status">${capitalizeFirstLetter(item.status)}</td>`;
    memberHtml += `<td class="member_res_status">${capitalizeFirstLetter(item.mem_type)}</td>`;
    memberHtml += '</tr>';
    return memberHtml;
}
function getMembers(res) {
    connection.query('SELECT member_id, name, email, phone_number, status, mem_type FROM member', (err, results) => {
        if (err) {
            console.error('Error querying member data:', err);
            response.writeHead(500);
            response.end('Server error');
            return;
        }

        let memberHtml = '';
        
        results.forEach(item => { memberHtml += createMemberHtml(item); });
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(memberHtml, 'utf-8');
    });

}

function insertMember(res, name, password, email, mem_type, phone_number, street_addr, city_addr, state, zipcode_addr) {

    accessLink.query('INSERT INTO member_credentials (member_password, member_email) VALUES (?, ?)', [password, email], (credentialErr, result) => {
        if (credentialErr) {
            console.log('error accessing access_control db table:', credentialErr);
        }
    });
    connection.query(`INSERT INTO member (password, name, status, mem_type, street_addr, city_addr, state, zipcode_addr, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [password, name, 'active', mem_type, street_addr, city_addr, state, zipcode_addr, phone_number, email], (newMemErr, result) => {
        if (newMemErr) {
            console.log('error entering new member into librarydev db:', newMemErr);
        }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'memberCreationSuccessful' }));
}
function removeMember(res, memberId) {
    connection.query('SELECT fines FROM member WHERE member_id = ?', [memberId], (finesErr, finesResult) => {
        if (finesErr) {
            console.log('Error accessing fines column:', finesErr);
            return;
        }

        const fines = finesResult[0].fines;

        // If fines are found, prevent deletion
        if (fines > 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Member has fines and cannot be removed' }));
            return;
        }

        // If no fines, proceed with member removal
        accessLink.query('DELETE FROM member_credentials WHERE member_id = ?', [memberId], (credentialErr, result) => {
            if (credentialErr) {
                console.log('Error accessing access_control db table:', credentialErr);
                return;
            }

            connection.query('UPDATE member SET status = ? WHERE member_id = ?', ['inactive', memberId], (removeMemberErr, result) => {
                if (removeMemberErr) {
                    console.log('Error updating member status:', removeMemberErr);
                    return;
                }

                // If deletion is successful
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Member deletion successful' }));
            });
        });
    });
}
module.exports = { getMembers, insertMember, removeMember};