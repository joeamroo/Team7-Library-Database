const http = require('http');
const url = require('url');
const fs = require('fs');
const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase } = require('./routes/catalog');
const { getDash } = require('./routes/dashboard');
const { getCredentials } = require('./routes/login');


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

function serve404(res, attemptedPath) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Not Found');
    console.log(`404 Not Found: ${attemptedPath}`);
}

const server = http.createServer((request, res) => {
    //const pathname = url.parse(request.url).pathname;
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

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
                case '/dashboard':
                    getDash(res);
                    break;
                case '/dashboard.css':
                    serveStaticFile('./front-end/dashboard/dashboard.css', 'text/css', res);
                    break;
                case '/login':
                    getCredentials(res);
                    break;
                case '/member-login.html':
                    serveStaticFile('./front-end/login/member-login.html', 'text/html', res);
                    break;
                case '/member-login.css':
                    serveStaticFile('./front-end/login/member-login.css', 'text/css', res);
                    break;
                case '/member-img.css':
                    serveStaticFile('./front-end/login/member-img.css', 'text/css', res);
                    break;
                case '/member-login.js':
                    serveStaticFile('./front-end/login/member-login.js', 'application/javascript', res);
                    break;
                default:
                    // outputs error code along with details
                    serve404(res, pathname);
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
            else if (pathname === '/catalog-hold') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        console.log(postData);
                        insertDataToDatabase(res, postData.itemTitle);
                    } 
                    catch (error) {
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