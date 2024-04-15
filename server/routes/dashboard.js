const mysql = require('mysql');


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

  function getSQLTable(queryResult, tableName) {
    // Check if queryResult is empty or undefined
    if (!queryResult || queryResult.length === 0) {
      return '<p>None</p>'; // Return a simple message if no data
    }
  
    const data = queryResult;
    const headers = Object.keys(data[0]); // Get headers from the keys of the first row
  
    // Generate table headers with id attributes
    const tableHeader = headers.map((headerText, index) => `<th id="header-${index}">${headerText}</th>`).join('');
  
   // Generate table rows
    const tableRows = data.map(rowData => {
      const cells = headers.map((key, index) => {
        const value = rowData[key] === null ? "Not Applicable" : rowData[key];
          return `<td id="${key}">${value}</td>`;
        }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');


    // Construct the table
    const table = `
      <table id="${tableName}">
        <thead>
          <tr>${tableHeader}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
    
    console.log("Function table: " + table);
    return table; // Return the HTML table string
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
        } 
        const greeting = 'Welcome, ' + result[0].name + '!';
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(greeting, 'utf-8');
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
      ];

    // Searches Database for user with memberID
    const query_info = 'SELECT name, email, status, phone_number, street_addr, city_addr, state, zipcode_addr ' +
                        'FROM member WHERE member_id = (?)';



    // Gets information from backend
    link.query(query_info, [memberId], (error, result) => {

      var firstName = '';
      var lastName = '';

      result.forEach(function(row) {
        var fullName = row.name;
        var nameParts = fullName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];
      });

      //console.log('firstName: ' + firstName);
      //console.log('lastName: ' + lastName);

    
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
            response.writeHead(204);
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

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Updates User Info                              │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function setUserDashInfo(response, memberId, firstName, lastName, phone_number,
                           street_addr, city_addr, state, zipcode_addr, email) {


      // Combines first name and last name
      const fullName = firstName + " " + lastName;
      console.log(fullName);

      // Query to search for
      const sql_query = 'UPDATE MEMBER SET name = ?, phone_number = ?, street_addr = ?, city_addr = ?,' +
                         'state = ?, zipcode_addr = ?, email = ? WHERE member_id = ?';

    // Values to update
    const values = [memberId, fullName, phone_number, street_addr, city_addr, state, zipcode_addr, email];

    // Use the memberId parameter in the query execution
      link.query(sql_query, values, function(err, result) {
      if (err) {
            console.error('Failed to insert member details:', err);
            console.log('Query Results: ', result);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end('Internal Server Error', 'utf-8');
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
// Execute the SQL query
const query = "SELECT TV.transaction_Id AS 'Order ID', " +
              "T.date_created AS 'Date', " +
              "CV.image_address AS 'Image', " +
              "TV.asset_type AS 'Item', " +
              "CV.year_released AS 'Year Released', " +
              "CV.book_movie_title_model AS 'Product', " +
              "CV.isbn AS 'ISBN', " +
              "CV.asset_id AS 'Serial Number', " +
              "CV.genres AS 'Genre', " +
              "CV.languages AS 'Language', " +
              "TV.returned AS 'Status' " +
              "FROM TRANSACTION AS T, " +
              "TRANSACTION_VIEW AS TV, " +
              "CATALOG_VIEW AS CV, " +
              "MEMBER AS M " +
              "WHERE M.member_id = T.member_id " +
              "AND T.transaction_id = TV.transaction_Id " +
              "AND TV.itemId = CV.asset_id;";


link.query(query, [memberId], (err, results) => {
  if (err) {
      console.error('Error executing the query:', err);
      response.writeHead(204, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
      return;
    }  else {

    // Converts SQL query to a table with Keys as IDs
    const tableHTML = getSQLTable(results, 'order-table');

    // Sends the table back to client
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(tableHTML);
    } 
  });
}

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Gets User Holds                                │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function getDashHoldsInfo(response, memberId) {

    // Searches Database for user with the memberID
    const query_name = 'SELECT name FROM member WHERE member_id = ?';

    

    // Gets information from backend
    link.query(query_name, [memberId], (error, result) => {
        if (error) {
            console.log('Error', memberId);
            response.writeHead(204);
            response.end('Server error');
            return;
        } else {
           const name = 'Welcome, ' + result[0].name + '!';
           response.writeHead(200, { 'Content-Type': 'text/html' });
           response.end(name, 'utf-8');
        }
    });
    
}





  




module.exports = { getUserDash, getUserDashInfo, setUserDashInfo, getUserOrderInfo, getDashHoldsInfo };


 /*function getSQLTable(queryResult) {
    // Check if queryResult is empty or undefined
    if (!queryResult || queryResult.length === 0) {
      return '<p>No data available</p>'; // Return a simple message if no data
    }
  
    const data = queryResult;
    const headers = Object.keys(data[0]); // Get headers from the keys of the first row
  
    // Generate table headers
    const tableHeader = headers.map(headerText => `<th>${headerText}</th>`).join('');
  
    // Generate table rows
    const tableRows = data.map(rowData => {
      const cells = headers.map(key => `<td>${rowData[key]}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
  
    // Construct the table
    const table = `
      <table>
        <thead>
          <tr>${tableHeader}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  
    return table; // Return the HTML table string
  }*/


  /*var tableHTML = '<table>' +
    '<thead>' +
        '<tr>' +
            '<th>Order ID</th>' +
            '<th>Date</th>' +
            '<th>Image</th>' +
            '<th>Item</th>' +
            '<th>Year Released</th>' +
            '<th>Product</th>' +
            '<th>ISBN</th>' +
            '<th>Serial Number</th>' +
            '<th>Genre</th>' +
            '<th>Language</th>' +
            '<th>Status</th>' +
        '</tr>' +
    '</thead>' +
    '<tbody>';*/

    /*results.forEach(transaction => {
      tableHTML += '<tr>';
      for (let key in transaction) {
        if(key === 'returned') {
          tableHTML += `<td id='returned'>${transaction[key]}</td>`;
        } else if (key === 'image_address') {
          tableHTML += `<td><img src="${transaction[key]}" style="max-width: 100%; max-height: 100%;"></td>`;
        } else {
          tableHTML += `<td>${transaction[key]}</td>`;
        }
          
      }
      tableHTML += '</tr>';
  });

    tableHTML += '</tbody>' + '</table>';*/