fs = require('fs');
http = require('http');
url = require('url');


http.createServer(function(req, res){
    var request = url.parse(req.url, true);
    var action = request.pathname;

    if (action == '/images/camera.jpg') {
	var img = fs.readFileSync('/tmp/camera.jpg');
	res.writeHead(200, {'Content-Type': 'image/jpeg' });
	res.end(img, 'binary');
    } else { 
	res.writeHead(200, {'Content-Type': 'text/plain' });
	res.write(action);
	res.end('Hello World \n');
    }
}).listen(8000);