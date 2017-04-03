/*
* Emerging technologies
* Paris Dauphine
*
* WARNING :
*   - console.log is used in this example to follow-up progression. Though, It is not a best practice for production apps :-) !
*   - Application here are implemented under the 'happy path' for the sake of clarity. It means that very limited of error traps are made.
*/

/*
express is required along with some iddlewares
- express-session for the Session management
- body-parser in order to parse the bdo of the pages (as json)
*/

var express = require('express');
var session = require("express-session");
var bodyParser = require('body-parser')

//Creates an Express application
var app = express();
//Enable the parser in order to interpret the POST to retrieve data
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(session({resave: true, saveUninitialized: true, secret: 'ThisWillBeOurSecret', cookie: { maxAge: 60000 }}));

var mysession;

//The profile is initialized in the session with a null value if it doesn't already exist

app.use(function(req, res, next){
  mysession = req.session;
  if (typeof(mysession.myprofile) == 'undefined') {
    mysession.myprofile = "";
  }
  if (typeof(mysession.myname) == 'undefined') {
    mysession.myname = "";
  }
  next();
})

////////////////////////////////////////////////////////////////////////////////
//EXPRESS Routes definition
//Express Route : page1
app.get('/page1/', function (req, res) {
  res.render('./pages/page1.ejs',{myname: mysession.myname,myprofile: mysession.myprofile, });
  console.log ('OPEN : Page1 : My name is ', mysession.myname);
});

//Express Route : POST : The profile is updated
app.post('/page1/profile/add/', function(req, res) {
  mysession.myname=req.body.myname;
  mysession.myprofile=req.body.myprofile;
  console.log ('POST Profile updated for : ',mysession.myname);
  console.log ('JSON Content : ',req.body);
  res.redirect('/page1');
})

//Express Route : No route Found : It is a 404
app.use(function (req,res,next){
  res.status(404);
  res.send('404! File not found')
})

// Defining the Server -
var server = app.listen(8080, function () {
var host = server.address().address;
var port = server.address().port;
  console.log('*******************************************************************');
  console.log('**    Paris Dauphine - Emerging technologies');
  console.log('**    Server ready for business at http://%s:%s', host, port);
  console.log('*******************************************************************');

});
