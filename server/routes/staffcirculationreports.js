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

  if (filters.name) {
    conditions.push(`m.name LIKE '%${filters.name}%'`);
  }

  if (filters.memberId) {
    conditions.push(`m.member_id = '${filters.memberId}'`);
  }

  if (filters.hasFines) {
    conditions.push('m.fine > 0');
  }

  if (filters.noTransactions) {
    conditions.push('t.transaction_id IS NULL');
  }

  if (conditions.length > 0) {
    return 'WHERE ' + conditions.join(' AND ');
  }

  return '';
}

function getMemberData(filters, callback) {
  const whereClause = buildWhereClause(filters);
  const query = `
    SELECT m.member_id, m.name, m.email, m.phone_number, m.state, m.city_addr, m.street_addr, m.zipcode_addr, m.fine, t.transaction_id, t.date_created, t.due_date, t.return_date
    FROM member m
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

function generateReport(filters, callback) {
  const whereClause = buildWhereClause(filters);
  const query = `
    SELECT m.fine, COUNT(t.transaction_id) AS holds
    FROM member m
    LEFT JOIN transaction t ON m.member_id = t.member_id
    ${whereClause}
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

    const averageFine = totalFine / result.length;
    const averageHolds = totalHolds / result.length;
    const reportData = { averageFine, averageHolds };

    callback(null, reportData);
  });
}

module.exports = {
  getMemberData,
  generateReport,
};
