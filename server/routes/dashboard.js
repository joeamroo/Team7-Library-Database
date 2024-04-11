const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const htmlTemplateTag = require('html-template-tag');

const link = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});


/*function getSQLTable(data) {
  
    const headers = Object.keys(data[0]);
  
    const tableRows = data.map(rowData => {
    const cells = headers.map(key => htmlTemplateTag`<td>${rowData[key]}</td>`);
    return htmlTemplateTag`<tr>${cells}</tr>`;
    });

    const tableHeader = headers.map(headerText => htmlTemplateTag`<th>${headerText}</th>`);
    const table = htmlTemplateTag`
    <table>
      <thead>
        <tr>${tableHeader}</tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
`;
    
}*/

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         Converts SQL to Tables                              │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

// Function to execute the SQL query and generate the HTML table
function getSQLTable(query, callback) {
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      callback(null);
      return;
    }

    const data = results;
    const headers = Object.keys(data[0]);
    const tableRows = data.map(rowData => {
      const cells = headers.map(key => htmlTemplateTag`<td>${rowData[key]}</td>`);
      return htmlTemplateTag`<tr>${cells}</tr>`;
    });
    const tableHeader = headers.map(headerText => htmlTemplateTag`<th>${headerText}</th>`);
    const table = htmlTemplateTag`
      <table>
        <thead>
          <tr>${tableHeader}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    callback(table);
  });
}


/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         Retrieves the full name                             │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

function getUserDash(response, memberId) {

    // Searches Database for user with the memberID
    const query_name = 'SELECT name FROM member WHERE member_id = ?';

    // Gets information from backend
    link.query(query_name, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(500);
            response.end('Server error');
            return;
        } else {
           const name = 'Welcome, ' + result[0].name + '!';
           response.writeHead(200, { 'Content-Type': 'text/html' });
           response.end(name, 'utf-8');
        }
    });
    
}

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         Retrieves Profile Info                              │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

function getUserDashInfo(response, memberId) {

    // HTML Elements
    const memberInfo = [
        { label: "First Name", id:"firstName", type: "text", value: "Ruthless"},
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
    const query_info = `
    SELECT
      name,
      email,
      status,
      phone_number,
      street_addr,
      city_addr,
      state,
      zipcode_addr
   FROM
      member
    WHERE
      member_id = ?
  `;



    // Gets information from backend
    link.query(query_info, [memberId], (error, result) => {

      const full_name = result.name; 
      const nameArray = full_name.split(' '); 
      const firstName = nameArray[0]; 
      const lastName = nameArray.length > 1 ? nameArray[1] : ''; 

    
      let html = '';

        // New values
        const updatedMemberInfo = memberInfo.map(info => {
            switch (info.id) {
              case "firstName":
                return { ...info, value: firstName };
              case "lastName":
                return { ...info, value: lastName };
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
};

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Updates User Info                              │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function setUserDashInfo(response, memberId, firstName, lastName, phone_number,
                           street_addr, city_addr, state, zipcode_addr, email) {

      // Query to search for
      const sql_query = `
      INSERT INTO MEMBER (
      memberId,
      firstName,
      lastName,
      phone_number,
      street_addr,
      city_addr,
      state,
      zipcode_addr,
      email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Use the memberId parameter in the query execution
    link.query(sql_query, [memberId, firstName, lastName, phoneNumber, 
                          streetAddr, cityAddr, state, zipcodeAddr, email],
                                                  function(err, result) {
      if (err) {
        console.error('Failed to generate table');
        response.writeHead(409, { 'Content-Type': 'text/html' });
        response.end('Sorry, an error occurred. Please try again later');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end('Profile settings successfully updated!', 'utf-8');
      }
  });
}

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           Retrieves User Order Info                         │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

function getUserOrderInfo(response, memberId) {

  const sqlQuery = `
  SELECT
      TV.transaction_Id AS 'Order ID',
      T.date_created AS 'Date Purchased',
      TV.asset_type AS 'Item',
      CV.image_address AS '',
      CV.year_released AS 'Year Released',
      CV.book_movie_title_model AS 'Product',
      CV.isbn AS 'ISBN',
      CV.serial_number AS 'Serial Number',
      CV.asset_id AS 'Condition',
      CV.genres AS 'Genre',
      CV.languages AS 'Language',
      TV.returned AS 'Status'
  FROM
      TRANSACTION AS T
      INNER JOIN TRANSACTION_VIEW AS TV ON T.transaction_id = TV.transaction_Id
      INNER JOIN CATALOG_VIEW AS CV ON TV.itemId = CV.asset_id
      INNER JOIN MEMBER AS M ON M.member_id = T.member_id
  WHERE
      M.member_id = ?
`;
    

  // Use the memberId parameter in the query execution
  link.query(sqlQuery, [memberId], (table) => {
    if (table) {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(table, 'utf-8');
    } else {
      console.error('Failed to generate table');
    }
  });
}


/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Gets User Holds                                │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function getDashHoldsInfo(response, memberId) {

    //Text
  }





  




module.exports = { getUserDash, getUserDashInfo, setUserDashInfo, getUserOrderInfo, getDashHoldsInfo };
