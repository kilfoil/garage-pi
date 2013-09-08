var fs = require('fs');
var http = require('http');
var child_process = require("child_process");

var stdout = 'not-running';

// Start motion server on 8081
var motion = child_process.spawn('motion', 
				 [ '-c', 'conf/motion.conf'],
				 { cwd: undefined,
				   env: { LD_PRELOAD : '/usr/lib/uv4l/uv4lext/armv6l/libuv4lext.so'}				
				 });

http.createServer(function (req, resp) {

    var action = req.url.substring(1).split("/")[0];
    console.log('Action: ' + action);

    if(action == 'index')
    {
	sendHtml(resp, './index.html');
    }

    if(action == 'openclose')
    {
	runCommand(resp, 'scripts/flash');
    }
}).listen(8088);

console.log('Server running at port 8088');


function sendHtml(response, page) {
    fs.readFile(page, function (err, html) {	
	response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    });
}

function runCommand(response, command){
    child_process.exec(command,
		       function (error, stdout, stderr) {
			   response.writeHead(200, {"Content-Type": "application/json"});
			   response.write(
			       JSON.stringify({ 
				   error: error,
			       })
			   );
			   response.end();
		       });	
}
process.on('SIGTERM', function(){
    console.log('Stopping Motion Server...');
    motion.kill('SIGTERM');
    console.log('Terminating...');
    process.exit(1);
});