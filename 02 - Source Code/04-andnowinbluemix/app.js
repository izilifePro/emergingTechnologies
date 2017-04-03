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

//The list of profiles is initialized in the session with a null list if it doesn't already exist

app.use(function(req, res, next){
  mysession = req.session;
  if (typeof(req.session.profiles) == 'undefined') {
    mysession.profiles = [];
  }
  next();
})

////////////////////////////////////////////////////////////////////////////////
//EXPRESS Routes definition
//Express Route : page1
app.get('/page1/', function (req, res) {
  res.render('./pages/page1.ejs',{profileslist: mysession.profiles});
  console.log ('OPEN : Page1 : List of profiles : ', mysession.profiles);
});

//Express Route : POST : The profile is updated
app.post('/page1/book/add/', function(req, res) {
  mysession.profiles.push(req.body);
  console.log ('POST 1 Book added');
  console.log ('JSON Content : ',req.body);
  res.redirect('/page1');
})

//Express Route : GET : The profile is removed
app.get('/page1/book/remove/:id', function(req, res) {
  if (req.params.id != '') {
    mysession.profiles.splice(req.params.id, 1);
    console.log ('GET 1 book removed');
    res.redirect('/page1');
  };
});

//Express Route : No route Found : It is a 404
app.use(function (req,res,next){
  res.status(404);
  res.send('404! File not found')
})

// Defining the Server - Please note the 'cloud enabled' variable
var host = '0.0.0.0';
var port =  process.env.PORT || 8080;
var server = app.listen(port, host);

console.log('*******************************************************************');
console.log('**    Paris Dauphine - Emerging technologies');
console.log('**    Server ready for business at http://%s:%s', host, port);
console.log('*******************************************************************');
