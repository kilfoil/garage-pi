var http = require('http');
var child_process = require("child_process");
var stdout = 'not-running';
var fs = require('fs');
var indexPage;

fs.readFile('./player.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    indexPage = html;
});

http.createServer(function (req, resp) {

    var action = req.url.substring(1).split("/")[0];
    console.log('Action: ' + action);

    if(action == 'stream')
    {
	console.log("***** url ["+req.url+"], call ");
    
	// Write header
	resp.writeHead(200, {'Content-Type': 'Video/H264', 'Connection': 'keep-alive'});
	
	if (stdout != 'not-running')
	{
	    console.log("Getting stream already created for camera");
	    stdout.pipe(resp);
	}
	else
	{
	    console.log("Initializing camera");

/*
	    //start vlc
	    var vlc = child_process.spawn('cvlc',[
		"v4l2:///dev/video0",
		"--v4l2-width", "640",
		"--v4l2-height", "480",
		"--v4l2-chroma", "h264",
		"--sout", "-"]);

	    stdout = vlc.stdout;

*/
	    // Start raspivid
	    var raspivid = child_process.spawn("raspivid",[
		"-t", "999999", 
		"-o", "-"                     // Output to STDOUT
	    ]);
	    stdout = raspivid.stdout;


	}
	
	// Pipe the video output to the client response
	stdout.pipe(resp);
    }
    if(action = 'player')
    {
	console.log('Player request...');
	resp.writeHeader(200, {"Content-Type": "text/html"});  
        resp.write(indexPage);  
        resp.end();  
    }

}).listen(8088);

console.log('Server running at port 8088');