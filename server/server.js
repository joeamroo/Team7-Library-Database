const http = require('http');
const url = require('url');
const { getInitialCatalogInfo, getCatalogSearchWithRestrictions } = require('./routes/catalog');
const fs = require('fs');


// Function to serve static files (CSS, JavaScript)
function serveStaticFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Server error');
        } 
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
}

function serve404(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Not Found');
}

const server = http.createServer((request, res) => {
    const pathname = url.parse(request.url).pathname;

    switch (request.method) {
        case 'GET':
            switch (pathname) {
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
                    serve404(res);
            }
            break;
        case 'POST':
            if (pathname === '/catalog') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        console.log(postData);
                        getCatalogSearchWithRestrictions(res, postData.keyword, postData.searchBy, postData.limitBy, postData.availability, postData.genres, postData.langs, postData.years, postData.brands);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            } 
            else {
                serve404(res);
            }
            break;
    }
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});