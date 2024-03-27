const http = require('http');
const url = require('url');
const fs = require('fs');
const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase } = require('./routes/catalog');
const { getDash } = require('./routes/dashboard');
const { getCredentials } = require('./routes/login');

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://cougar-chronicles.vercel.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

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

    setCorsHeaders(res);

    if (request.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    switch (request.method) {
        case 'GET':
            switch (pathname) {
                case '/catalog':
                    getInitialCatalogInfo(res);
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
                    serve404(res, pathname);
            }
            break;
        case 'POST':
            if (pathname === 'api/catalog') {
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
            else if (pathname === 'api/catalog-hold') {
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
        default:
            serve404(res, pathname);
        
    }
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});