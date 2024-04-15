const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function addDevices(res,model,brand,serialNum,imageLink,totalCopies){
    connection.query('INSERT INTO device (model, brand, serial_number, device_img_address, total_available,available_copies,device_condition,current_holds) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)', [ model, brand, serialNum, imageLink, totalCopies,totalCopies,'1', '0'], (err) => {
        if (err) {
            console.log('error entering new device into librarydev db:', err);
        }
    })


    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'deviceCreationSuccessful' }));
    };

    module.exports = { addDevices };