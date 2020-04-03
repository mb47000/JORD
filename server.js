const http = require('http');
const fs = require('fs');
const path = require('path');


http.createServer(function (req, res) {

    console.log(req.url);

    let filePath = '.' + req.url;
    if (filePath == './')
        filePath = './index.html';
    else if( String(path.extname(req.url)) === '' ){
        res.writeHead(302, { 'Location': '/#' + req.url.replace('/', '') });
        res.end();
    }

    let extname = String(path.extname(filePath)).toLowerCase();

    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    });

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');
