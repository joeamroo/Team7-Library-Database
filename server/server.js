const http = require('http');
const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase, getCurrentHolds } = require('./routes/catalog');
const { insertTransactionInfo } = require('./routes/checkout');
const { getTransactionItems, returnItems } = require('./routes/returnItems');
const { getDash } = require('./routes/dashboard');
const { getCredentials } = require('./routes/login');
const path = require('path');

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}


function serve404(res, attemptedPath) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Not Found');
    console.log(`404 Not Found: ${attemptedPath}`);
}

const server = http.createServer((request, res) => {
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
                case '/initial-catalog':
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
            if (pathname === '/catalog') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
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
                        insertDataToDatabase(res, postData.itemTitle);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/checkout-insert') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        insertTransactionInfo(res, postData.memberID, postData.items);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/getTransaction') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getTransactionItems(res, postData.transactionId);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/sendReturn') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        console.log(postData);
                        returnItems(res, postData);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/get-current-holds') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        console.log(postData);
                        getCurrentHolds(res, postData.medium, postData.itemId);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else {
                console.log('NOT FINDING PATH');
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