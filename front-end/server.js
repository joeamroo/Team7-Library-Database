const http = require('http');
const fs = require('fs');

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        servePage('./home.html', res); // Assuming your main HTML file is 'index.html'
    } 
    else if (req.url === '/home.css') {
        serveStaticFile('./home.css', 'text/css', res); // Adjust the file path and content type as needed
    } 
    else if (req.url === '/home.js') {
        serveStaticFile('./home.js', 'text/javascript', res); // Adjust the file path and content type as needed
    } 
    else {
        serve404(res);
    }
});

// Function to serve static files (CSS, JavaScript, HTML)
function serveStaticFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            serve404(res);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Function to handle 404 Not Found
function serve404(res) {
    res.writeHead(404);
    res.end('Page not found');
}

// Start the server
const port = 3001; // You can use any port number you prefer
server.listen(port, () => {
    console.log(`Front-end development server is running on port ${port}`);
});