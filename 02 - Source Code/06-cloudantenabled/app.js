/*
* Emerging technologies - Session 2015
* Paris Dauphine
*
* WARNING : console.log is used in this example to follow-up progression. Though, It is not a best practice for production apps :-) !
*/
/*
express is required along with some iddlewares
- express-session for the Session management
- body-parser in order to parse the bdo of the pages (as json)
*/

var express = require('express');
//var session = require("express-session");
var bodyParser = require('body-parser');

//Creates an Express application
var app = express();
// Express usage of Static file - css , image
app.use(express.static('./public'));
//Session pour stocker les donnée
var mysession = [];
//Enable the parser in order to interpret the POST to retrieve data
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////
//CLOUDANT
var Cloudant = require('cloudant');

var me = "7f8849ad-2657-421a-a758-c05927828a2f-bluemix"; // Set this to your own account
var password = "53709b004caffb1d16071931f817afb74b754c8f81ff03ba544973c99cf8ed0a";// Set this to your own account
var cloudant = Cloudant({account:me, password:password});
//var cloudant = Cloudant("https://63d714a1-ba3a-4a0a-9a18-dda46570d81e-bluemix:d79f900671ce0286dd257541a4d8744ba2e071d379d437da3048a34aa33bf17c@63d714a1-ba3a-4a0a-9a18-dda46570d81e-bluemix.cloudant.com");

/* Cloudant : Optional code to list all the database for this connection
cloudant.db.list(function(err, allDbs) {
console.log('All my databases: %s', allDbs.join(', '))
});
*/
//PRE Requisite : The Cloudant database mybooks should be created in CLOUDANT
// Remark : Work is done on the remote database. No replication enabled.
var mybooksdb = cloudant.use('mybooks');
/*Cloudant : Optional code to list all the database indexes
mybooksdb.index(function(er, result) {
if (er) {
throw er;
}
console.log('The database has %d indexes', result.indexes.length);
for (var i = 0; i < result.indexes.length; i++) {
console.log('  %s (%s): %j', result.indexes[i].name, result.indexes[i].type, result.indexes[i].def);
}});
*/
var thebookslist=[];
mybooksdb.find({selector:{type:"book"}}, function(er, result) {
  if (er) {    throw er;  }
  thebookslist=result.docs;
  //console.log('Found %d books in documents', result.docs.length);
});

////////////////////////////////////////////////////////////////////////////////
//EXPRESS Routes definition
//Express Route : GET at the root page. Display the Booklist and Book creation page
app.get('/', function (req, res) {
  // The collection of books is computed to rely on fresh data
  mybooksdb.find({selector:{type:"book"}}, function(er, result) {
    if (er) { throw er; }
    thebookslist=result.docs;
    console.log('OPEN main page with %d books', result.docs.length);
    res.render('./pages/mainpage.ejs',{ booklist: thebookslist});
  });
});
//Express Route : POST to add a book to the collection
app.post('/book/add/', function(req, res) {
  mybooksdb.insert(req.body);
  console.log ('Book added');
  res.redirect('/');
});

//Express Route : GET to remove a book from a collection the collection : ID and revision are required
app.get('/book/remove/:id/:rev', function(req, res) {
  if (req.params.id != '') {
    mybooksdb.destroy(req.params.id,req.params.rev)
    console.log ('Book removed');
    res.redirect('/');
  };
});

//Express Route : GET to open the details of a book
//Remark: For the example the data are retrieved from the database to demonstrate the "get" on ID primitive
app.get('/book/open/:id', function(req, res) {
  mybooksdb.get(req.params.id, { include_doc: true }, function(err, body) {
    if (!err){
      res.render('./pages/bookdetails.ejs',{ booklist: body});
      console.log ('OPEN Book details');
    }
    else {  res.redirect('/');}
  });
});

//Fallback by default : the page can not be opened !
app.use(function (req,res,next){
  res.status(404);
  res.send('404! File not found');
});

// Defining the Server - Please note the 'cloud enabled' variable
var host = '0.0.0.0';
var port =  process.env.PORT || 8080;
var server = app.listen(port, host);

console.log('*******************************************************************');
console.log('**    Paris Dauphine 2015 - Emerging technologies');
console.log('**    Server ready for business at http://%s:%s', host, port);
console.log('*******************************************************************');
