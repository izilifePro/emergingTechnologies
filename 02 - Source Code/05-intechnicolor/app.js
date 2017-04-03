/*
* Emerging technologies
* Paris Dauphine
*
* WARNING :
*   - console.log is used in this example to follow-up progression. Though, It is not a best practice for production apps :-) !
*   - Application here are implemented under the 'happy path' for the sake of clarity. It means that very limited of error traps are made.
*
* Express is required along with some iddlewares
*   - express-session for the Session management
*   - body-parser in order to parse the bdo of the pages (as json)
*/

var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
//Creates an Express application
var app = express();
// Express usage of Static file - css , image
app.use(express.static("./public"));

//Enable the parser in order to interpret the POST to retrieve data
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(session({resave: true, saveUninitialized: true, secret: "ThisWillBeOurSecret", cookie: { maxAge: 600000 }}));

var mysession;
//The list of profiles is initialized in the session with a null list if it doesn't already exist

app.use(function(req, res, next){
  mysession = req.session;
  if (typeof(req.session.books) === "undefined") {
    mysession.books = [];
  }
  next();
});
////////////////////////////////////////////////////////////////////////////////
//EXPRESS Routes definition
//Express Route : /
app.get("/", function (req, res) {
  res.render("./pages/mainpage.ejs",{ booklist: mysession.books});
  console.log ("GET : List of books : ", mysession.books);
});

//Express Route : POST : The Booklist is updated
app.post("/book/add/", function(req, res) {
  mysession.books.push(req.body);
  console.log ("POST 1 Book added");
  console.log ("JSON Content : ",req.body);
  res.redirect("/");
});

//Express Route : POST : A book is removed
app.get("/book/remove/:id", function(req, res) {
  if (req.params.id !== "") {
    mysession.books.splice(req.params.id, 1);
  }
  console.log ("GET 1 book removed");
  res.redirect("/");
});

//Express Route : GET : Open the detail of a book
app.get("/book/open/:id", function(req, res) {
  if (mysession.books[req.params.id ] !== undefined){
    res.render("./pages/bookdetails.ejs",{ booklist: mysession.books[req.params.id ]});
    console.log ("GET: Book details");
  }else {  res.redirect("/");}
});

//Express Route : No route Found : It is a 404
app.use(function (req,res,next){
  res.status(404);
  res.send("404! File not found");
});

// Defining the Server - Please note the 'cloud enabled' variable
var host = '0.0.0.0';
var port =  process.env.PORT || 8080;
var server = app.listen(port, host);

console.log("*******************************************************************");
console.log("**    Paris Dauphine - Emerging technologies");
console.log("**    Server ready for business at http://%s:%s", host, port);
console.log("*******************************************************************");
