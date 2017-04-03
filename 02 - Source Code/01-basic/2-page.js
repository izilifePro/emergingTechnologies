/*
* Emerging technologies
* Paris Dauphine
*
* WARNING :
*   - console.log is used in this example to follow-up progression. Though, It is not a best practice for production apps :-) !
*   - Application here are implemented under the 'happy path' for the sake of clarity. It means that very limited of error traps are made.
*/
var http=require('http');
var server = http.createServer(function (req,res){
  res.writeHead(200);
  res.end('Hi ! Even better now in the browser');
});
server.listen(8080);
