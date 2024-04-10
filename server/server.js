const http = require('http');
require("dotenv").config();

const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase } = require('./routes/catalog');
const { insertTransactionInfo } = require('./routes/checkout');
const { getTransactionItems, returnItems } = require('./routes/returnItems');
const { getUserDash, getUserDashInfo, getUserOrderInfo } = require('./routes/dashboard');
const { loginUser } = require('./routes/login');
const { registerMember } = require('./routes/register');
const { getListedEvents, eventSignUp } = require('./routes/classesnEvents');
const { resetPassword } = require('./routes/forgot-pwd');
const { getEventReports } = require ('./routes/staffeventsreports');
const { getEmployees } = require ('./routes/adminDashboard');

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
                case '/events':
                    getEmployees(res);
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
            else if (pathname === '/getEventReports') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getEventReports(postData.eventId, res);
                    } 
                    catch (error) {
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
                        insertDataToDatabase(res, postData.itemTitle, postData.memberId);
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
            else if (pathname === '/logIn')  {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        console.log(postData);
                        loginUser(res, postData.email, postData.password, postData.isStaff);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            } 
            else if (pathname === '/registerMember') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        registerMember(res, postData.fullName, postData.addr, postData.city, postData.state, postData.zipcode, postData.phoneNum, postData.email, postData.password, postData.memType);
                    } catch (error) {
                        console.error('Error parsin JSON', error);
                    }
                });
            } 
            else if (pathname === '/getDashname') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getUserDash(res, postData.memberId);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                });
            }
            else if (pathname === '/getDashInfo') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getUserDashInfo(res, postData.memberId);
                    } catch (error) {
                        console.error('Error parsing JSON: ', error);
                    }
                });
            }
            else if (pathname === '/getDashOrders') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getUserOrderInfo(res, postData.memberId);
                    } catch (error) {
                        console.error('Error parsing JSON: ', error);
                    }
                });
            }
            else if (pathname === '/reset-password') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        resetPassword(res, postData.user_id, postData.email, postData.new_password);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else {
                console.log('something went wrong');
                serve404(res, pathname);
            }
            break;
           
    }
});





const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 