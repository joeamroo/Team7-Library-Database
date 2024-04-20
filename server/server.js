const http = require('http');
const url = require('url');
const htmlTemplateTag = require('html-template-tag');
require("dotenv").config();

const { getInitialCatalogInfo, getCatalogSearchWithRestrictions, insertDataToDatabase } = require('./routes/catalog');
const { insertTransactionInfo } = require('./routes/checkout');
const { getTransactionItems, returnItems } = require('./routes/returnItems');
const { getUserDash, getUserDashInfo, setUserDashInfo, getUserOrderInfo, getDashHoldsInfo, getUserEventsInfo,
        updateUserEventsInfo} = require('./routes/dashboard');
const { loginUser } = require('./routes/login');
const { registerMember } = require('./routes/register');
const { getListedEvents, eventSignUp } = require('./routes/classesnEvents');
const { resetPassword } = require('./routes/forgot-pwd');
const { getEventReports } = require ('./routes/staffeventsreports');
const { getEmployees, insertStaff, removeStaff, updateStaffRole, filterStaff } = require ('./routes/adminStaffManagement');
const { getAdminAlerts, getEventsForAdmin, insertEvent, deleteEvent, filterEvents } = require('./routes/adminEventManagement');
const { getItemsForAdmin, filterCatalogItems, getAdminInfo } = require('./routes/adminCatalogManagement');
const { updateFine, getFineAmount } = require('./routes/payFine');
const { addItems } = require('./routes/add-items');
const { getMemberData, generateReport } = require('./routes/staffcirculationreports');
const { addDevices } = require('./routes/addDevices');



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
                case '/getAdminAlerts':
                    getAdminAlerts(res);
                    break;
                case '/reportmembers':
                    try {
                        const queryObject = url.parse(request.url, true).query;
                        const filters = {
                            name: queryObject.name,
                            memberId: queryObject.memberId,
                          };
                        getMemberData(filters, (err, result) => {
                            if (err) {
                                console.error('Error fetching member data:', err);
                                res.statusCode = 500;
                                res.end('Internal server error');
                            } else {
                                console.log('Server Response:', result);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(result));
                            }
                        });
                    } catch (err) {
                        console.error('Error in /reportmembers route:', err);
                        res.statusCode = 500;
                        res.end('Internal server error');
                    }
                                break;
                case '/generateReport':
                        try {
                          const queryObject = url.parse(request.url, true).query;
                          const filters = {
                            name: queryObject.name,
                            memberId: queryObject.memberId,
                          };
                          generateReport(filters, (err, result) => {
                            if (err) {
                              console.error(err);
                              res.statusCode = 500;
                              console.error('Error fetching member data:', err);
                            } else {
                              console.log('Server Response:', result);
                              res.statusCode = 200;
                              res.setHeader('Content-Type', 'application/json');
                              res.end(JSON.stringify(result));
                            }
                          });
                        } catch (err) {
                            console.error('Error in /generateReport route:', err);
                            res.statusCode = 500;
                          res.end('Internal server error');
                        }
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
                        // Fetch notifications from the alerts_for_staff table
            else if (pathname === '/getNotifications') {
                try {
                const query = 'SELECT * FROM librarydev.alerts_for_staff WHERE continue_alerting = 1';
                connection.query(query, (error, results) => {
                    if (error) {
                    console.error('Error fetching notifications:', error);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                    }
                });
                } catch (error) {
                console.error('Error in /getNotifications route:', error);
                res.statusCode = 500;
                res.end('Internal Server Error');
                }
            }
            
            // Fetch holds from the alerts_for_staff table
            else if (pathname === '/getHolds') {
                try {
                const query = 'SELECT * FROM librarydev.alerts_for_staff WHERE continue_alerting = 1';
                connection.query(query, (error, results) => {
                    if (error) {
                    console.error('Error fetching holds:', error);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                    }
                });
                } catch (error) {
                console.error('Error in /getHolds route:', error);
                res.statusCode = 500;
                res.end('Internal Server Error');
                }
            }
            
            // Resolve a hold and update the continue_alerting value
            else if (pathname === '/resolveHold') {
                let body = '';
                request.on('data', (chunk) => {
                body += chunk.toString();
                });
                request.on('end', () => {
                try {
                    const postData = JSON.parse(body);
                    const alertId = postData.alertId;
                    const query = 'UPDATE alerts_for_staff SET continue_alerting = 0 WHERE alert_id = ?';
                    connection.query(query, [alertId], (error, results) => {
                    if (error) {
                        console.error('Error resolving hold:', error);
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Hold resolved successfully' }));
                    }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.statusCode = 400;
                    res.end('Bad Request');
                }
                });
            }
            
            // Fetch high-demand books
            else if (pathname === '/getHighDemandItems') {
                try {
                  const query = `
                    SELECT 'Book' AS item_type, title AS item_name, current_holds 
                    FROM librarydev.book
                    WHERE current_holds >= 7
                    UNION
                    SELECT 'Movie' AS item_type, title AS item_name, current_holds
                    FROM librarydev.movie
                    WHERE current_holds >= 7
                    UNION
                    SELECT 'Device' AS item_type, model AS item_name, current_holds
                    FROM librarydev.device
                    WHERE current_holds >= 7
                  `;
                  connection.query(query, (error, results) => {
                    if (error) {
                      console.error('Error fetching high-demand items:', error);
                      res.statusCode = 500;
                      res.end('Internal Server Error');
                    } else {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(results));
                    }
                  });
                } catch (error) {
                  console.error('Error in /getHighDemandItems route:', error);
                  res.statusCode = 500;
                  res.end('Internal Server Error');
                }
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
                        getUserOrderInfo(res, postData.memberId, postData.startDate, postData.endDate, postData.choice);
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
            else if (pathname === '/getDashEvents') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getUserEventsInfo(res, postData.memberId);
                    } catch (error) {
                        console.error('Error parsing JSON: ', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/setDashEvents') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        setUserEventsInfo(res, postData.memberID, postData.eventId);
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
                        insertEvent(res, postData.name, postData.des, postData.img, postData.category, postData.sponsor, postData.date, postData.normalizedStartTime, postData.stPeriod, postData.normalizedEndTime, postData.endPeriod);
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
                        filterEvents(res, postData.startDate, postData.endDate, postData.sponsor, postData.memType, postData.time);
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
            else if (pathname === '/getFineAmount') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        getFineAmount(res, postData.memberId);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/add-items') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        addItems(res, postData.itemType,postData.title,postData.authorDirector,postData.isbn,postData.category,postData.publisherProducer,postData.publicationReleaseDate,postData.imageLink,postData.totalCopies,postData.rating);
                    } 
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                        serve404(res);
                    }
                });
            }
            else if (pathname === '/addDevices') {
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });
                request.on('end', () => {
                    try {
                        const postData = JSON.parse(body);
                        addDevices(res,postData.model,postData.brand,postData.serialNum,postData.imageLink,postData.totalCopies);
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
            default:
            serve404(res, pathname);
    }
});





const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 