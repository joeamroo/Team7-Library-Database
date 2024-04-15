const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function addDevices(res,deviceID,brand,model,serialNum,imageLink,totalCopies){
    connection.query('INSERT INTO device (device_id, brand, model, serial_number, device_img_address, total_copies,available_copies,device_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [deviceID, brand, model, serialNum, imageLink, totalCopies,totalCopies,'1'], (err) => {
        if (err) {
            console.log('error entering new device into librarydev db:', err);
        }
    })


    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'deviceCreationSuccessful' }));
    };

    module.exports = { addDevices };