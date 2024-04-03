const http = require('http');
const url = require('url');
const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase } = require('./routes/catalog');
const { insertTransactionInfo } = require('./routes/checkout');
const { getTransactionItems, returnItems } = require('./routes/returnItems');
const { getUser } = require('./routes/dashboard');
const { loginUser } = require('./routes/login');
const { registerUser } = require('./routes/register');
const { getListedEvents, eventSignUp } = require('./routes/classesnEvents');

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
                case '/events':
                    getListedEvents(res);
                    break;
                default:
                    serve404(res, pathname);
            }
            break;
        case 'POST':
            setCorsHeaders(res);
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
            else if (pathname === '/event-signup') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        eventSignUp(res, postData.eventId, postData.memberId);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/login') {
                
            } 
            else if (pathname === '/loginUser') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        console.log(postData);
                        loginUser(res, postData.username, postData.password);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            } 
            else if (pathname === '/register') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        registerUser(res, postData.first_name, postData.last_name, postData.address,
                                        postData.city_addr, postData.state_addr, postData.zipcode_addr,
                                        postData.email, postData.password);
                    } catch (error) {
                        console.error('Error parsin JSON', error);
                    }
                });

            } 
            else {
                serve404(res, pathname);
            }
            break;
           
    }
});




/*const serv = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/login') {
      let body = '';
  
      req.on('data', chunk => {
        body += chunk.toString();
      });
  
      req.on('end', () => {
        const { username, password } = JSON.parse(body);
  
        // Perform authentication logic here
        if (username === 'validuser' && password === 'validpassword') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Login successful' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  });*/


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 