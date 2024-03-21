const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to LibraryDev database');
});

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        servePage(res);
    } 
});


// Function to serve static files (CSS, JavaScript)
function serveStaticFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            serve404(res);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Function to handle 404 Not Found
function serve404(res) {
    res.writeHead(404);
    res.end('Page not found');
}

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});