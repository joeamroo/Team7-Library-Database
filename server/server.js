const http = require('http');
const url = require('url');
const htmlTemplateTag = require('html-template-tag');
require("dotenv").config();

const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase } = require('./routes/catalog');
const { insertTransactionInfo } = require('./routes/checkout');
const { getTransactionItems, returnItems } = require('./routes/returnItems');
const { getUserDash, getUserDashInfo, setUserDashInfo, getUserOrderInfo, getDashHoldsInfo } = require('./routes/dashboard');
const { loginUser } = require('./routes/login');
const { registerMember } = require('./routes/register');
const { getListedEvents, eventSignUp } = require('./routes/classesnEvents');
const { resetPassword } = require('./routes/forgot-pwd');
const { getEventReports } = require ('./routes/staffeventsreports');
const { getEmployees, insertStaff, removeStaff, updateStaffRole, filterStaff } = require ('./routes/adminStaffManagement');
const { getEventsForAdmin, insertEvent, deleteEvent, filterEvents } = require('./routes/adminEventManagement');
const { getItemsForAdmin, filterCatalogItems, getAdminInfo } = require('./routes/adminCatalogManagement');
const { updateFine } = require('./routes/payFine');

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
        res.writeHead(204);
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
                case '/getEmployees':
                    getEmployees(res);
                    break;
                case '/getEventsForAdmin':
                    getEventsForAdmin(res);
                    break;
                case '/getItemsForAdmin':
                    getItemsForAdmin(res);
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
                        serve404(res);
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
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/setDashInfo') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        setUserDashInfo(res, postData.memberId, postData.firstName,
                                            postData.lastName, postData.phone_number,
                                            postData.street_addr, postData.city_addr,
                                            postData.state, postData.zipcode_addr, 
                                            postData.email);
                    } catch (error) {
                        console.error('Error parsing JSON: ', error);
                        serve404(res);
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
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/getUserHolds') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getDashHoldsInfo(res, postData.memberId);
                    } catch (error) {
                        console.error('Error parsing JSON: ', error);
                        serve404(res);
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
            else if (pathname === '/addStaff') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        insertStaff(res, postData.name, postData.phoneNum, postData.email, postData.password, postData.supervisor, postData.position);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/removeStaff') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        removeStaff(res, postData.email, postData.staff_id, postData.empStatus);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/updStaffRole') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        updateStaffRole(res, postData.empId, postData.empPos, postData.empSuper);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/filterStaff') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        filterStaff(res, postData.empStatus, postData.empPosition);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/insertEvent') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        insertEvent(res, postData.name, postData.des, postData.img, postData.sponsor, postData.date, postData.normalizedStartTime, postData.stPeriod, postData.normalizedEndTime, postData.endPeriod);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/deleteEvent') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        deleteEvent(res, postData.eventId);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/filterEvents') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        filterEvents(res, postData.startDate, postData.endDate);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/filterCatalogItems') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        filterCatalogItems(res, postData.itemType, postData.itemCondition, postData.checkoutDate);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/adminInfo') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getAdminInfo(res, postData.staffId);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/updMemberFine') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        updateFine(res, postData.memberId);
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
            // Handle other methods (e.g., POST) here
            default:
            serve404(res, pathname);
    }
});





const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 