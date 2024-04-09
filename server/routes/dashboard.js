const fs = require('fs');
const mysql = require('mysql');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});





function getUserDash(response, memberId) {

    // Searches Database for user with the memberID
    const query_name = 'SELECT name FROM member WHERE member_id = ?';
    let name = '';

    // Gets information from backend
    link.query(query_name, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
           name = 'Welcome, ';
           name += result[0].name;
           name += '!';
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(name, 'utf-8');
    });
    
}


/*function getUserDashInfo(response, memberId, name, email, mem_type, phone_number, street_addr, 
                                   city_addr, city_addr, state, zipcode_addr) {

    // Searches Database for user with memberID
    const query_info = 'SELECT name, email, status, mem_type, phone_number, street_addr,\
                        city_addr, state, zipcode_addr FROM member WHERE member_id = ?';
    
    link.query(query_info, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
            console.log('Successful retrieval!');
        }

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(
            result[0].name, result[0].email, result[0].status, result[0].mem_type,
            result[0].phone_number, result[0].street_addr, result[0].city_addr, 
            result[0].city_addr, result[0].state, result[0].zipcode_addr,
            result[0].fine
        ));
    });
    
}*/


function getUserDashInfo(response, memberId) {

    // HTML Elements
    const memberInfo = [
        { label: "Last Name", id: "lastName", type: "text", value: "Murthy" },
        { label: "Phone Number", id: "phone_number", type: "tel", value: "(541) 504-5555 " },
        { label: "Street Address", id: "street_addr", type: "text", value: "Privet Drive" },
        { label: "City", id: "city_addr", type: "text", value: "Houston" },
        { label: "State", id: "state", type: "text", value: "Texas" },
        { label: "Zip Code", id: "zipcode_addr", type: "text", value: "77063" },
        { label: "Email", id: "email", type: "email", value: "ssh!atlibrary@library.com" },
        { label: "Password", id: "password", type: "password", value: "ilikebigbooks@icannotlie.com" }
      ];

    // Searches Database for user with memberID
    const query_info = 'SELECT name, email, status, mem_type, phone_number, street_addr,\
                        city_addr, state, zipcode_addr FROM member WHERE member_id = ?';

    let html = '';

    // Gets information from backend
    link.query(query_info, [memberId], (error, result) => {

        // New values
        const updatedMemberInfo = memberInfo.map(info => {
            switch (info.id) {
              case "lastName":
                return { ...info, value: result[0].name };
              case "phone_number":
                return { ...info, value: result[0].phone_number };
              case "street_addr":
                return { ...info, value: result[0].street_addr };
              case "city_addr":
                return { ...info, value: result[0].city_addr };
              case "state":
                return { ...info, value: result[0].state };
              case "zipcode_addr":
                return { ...info, value: result[0].zipcode_addr };
              case "email":
                return { ...info, value: result[0].email };
              case "password":
                return { ...info, value: result[0].password };
              default:
                return info;
                console.log("failed");
            }
          });



        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
            updatedMemberInfo.forEach(info => {
                html += `
                  <div class="form-group">
                    <label for="${info.id}">${info.label}</label>
                    <input type="${info.type}" id="${info.id}" value="${info.value}">
                  </div>
                `;
              });

        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html, 'utf-8');
    });


}


// Function to fetch values from the database and update memberInfo
/*function getUserDashInfo(response, memberId) {

    const memberInfo = [
        { label: "Last Name", id: "lastName", type: "text", value: "" },
        { label: "Phone Number", id: "phone_number", type: "tel", value: "" },
        { label: "Street Address", id: "street_addr", type: "text", value: "" },
        { label: "City", id: "city_addr", type: "text", value: "" },
        { label: "State", id: "state", type: "text", value: "" },
        { label: "Zip Code", id: "zipcode_addr", type: "text", value: "" },
        { label: "Email", id: "email", type: "email", value: "" },
        { label: "Password", id: "password", type: "password", value: "" }
      ];

    const updatedMemberInfo = memberInfo.map(info => {
      return new Promise((resolve, reject) => {
        const query = `SELECT '${info.id}' FROM member WHERE memberId = ?`;
        connection.query(query, [memberId], (err, results) => {
          if (err) {
            console.error('Error executing query:', err);
            reject(err);
          } else {
            if (results.length > 0) {
              const newValue = results[0].value;
              resolve({ ...info, value: newValue });
            } else {
              resolve(info);
            }
          }
        });
      });
    });
  
    Promise.all(updatedMemberInfo)
      .then(updatedInfo => {
        console.log('Updated member info:', updatedInfo);
        // Perform any further actions with the updated member info
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(updatedMemberInfo, 'utf-8');
      })
      .catch(err => {
        console.error('Error updating member info:', err);
      })
      .finally(() => {
        // Close the database connection
        connection.end(err => {
          if (err) {
            console.error('Error closing database connection:', err);
          } else {
            console.log('Database connection closed');
          }
        });
      });
  }*/
  




module.exports = { getUserDash, getUserDashInfo };
