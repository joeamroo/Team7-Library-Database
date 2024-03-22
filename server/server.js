const http = require('http');
const url = require('url');
const { getInitialCatalogInfo } = require('./routes/catalog');
const fs = require('fs');
const mysql = require('mysql');


// Function to serve static files (CSS, JavaScript)
function serveStaticFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Server error');
            serve404(res);
        } 
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
}

const server = http.createServer((request, res) => {
    const pathname = url.parse(request.url).pathname;

    switch(pathname) {
        case '/':
            serveStaticFile('./front-end/home/home.html', 'text/html', res);
            break;
        case '/home.css':
            serveStaticFile('./front-end/home/home.css', 'text/css', res);
            break;
        case '/home.js':
            serveStaticFile('./front-end/home/home.js', 'application/javascript', res);
            break;
        case '/catalog':
            getInitialCatalogInfo(res); 
            break;
        case '/catalog.css':
            serveStaticFile('./front-end/catalog/catalog.css', 'text/css', res);
            break;
        case '/catalog.js':
            serveStaticFile('./front-end/catalog/catalog.js', 'application/javascript', res);
            break;
        default:
            res.writeHead(404);
            res.end('Not Found');
    }
});


const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});