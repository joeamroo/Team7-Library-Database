const mysql = require('mysql');

// Database connection configuration
const connection = mysql.createConnection({
  host: 'library-database-sytem.mysql.database.azure.com',
  user: 'lbrGuest',
  password: 'gu3st@cces$',
  database: 'librarydev',
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to LibraryDev database');
});

function buildWhereClause(filters) {
    const conditions = [];
  
    if (filters.name && filters.memberId) {
      conditions.push(`m.name LIKE '%${filters.name}%' AND m.member_id = '${filters.memberId}'`);
    } else if (filters.name) {
      conditions.push(`m.name LIKE '%${filters.name}%'`);
    } else if (filters.memberId) {
      conditions.push(`m.member_id = '${filters.memberId}'`);
    }
  
    if (conditions.length > 0) {
      return 'WHERE ' + conditions.join(' AND ');
    }
    return '';
  }

  //, t.transaction_id, t.date_created, t.due_date, t.return_date
  
//   LEFT JOIN transaction t ON m.member_id = t.member_id


  function getMemberData(filters, callback) {
    const whereClause = buildWhereClause(filters);
    const query = `
      SELECT m.member_id, m.name, m.email, m.phone_number, m.state, m.city_addr, m.street_addr, m.zipcode_addr, m.fine, t.transaction_id, t.date_created, t.due_date, t.return_date
      FROM librarydev.member m
      LEFT JOIN transaction t ON m.member_id = t.member_id
      ${whereClause}
    `;
  
    connection.query(query, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }
        // , COUNT(t.transaction_id) AS holds
      //   LEFT JOIN transaction t ON m.member_id = t.member_id


  function generateReport(filters, callback) {
    const whereClause = buildWhereClause(filters);
    const query = `
      SELECT m.member_id, m.fine , COUNT(t.transaction_id) AS holds
      FROM librarydev.member m
      ${whereClause}
      LEFT JOIN transaction t ON m.member_id = t.member_id
      GROUP BY m.member_id
    `;
  
    connection.query(query, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      let totalFine = 0;
    let totalHolds = 0;
    result.forEach((row) => {
      totalFine += row.fine;
      totalHolds += row.holds;
    });

    const averageFine = result.length > 0 ? totalFine / result.length : 0;
    const averageHolds = result.length > 0 ? totalHolds / result.length : 0;
    const reportData = { averageFine, averageHolds, memberData: result };

    callback(null, reportData);
    });
  }
  

module.exports = {
  getMemberData,
  generateReport,
};
