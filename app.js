'use strict';
var createError = require('http-errors');
var env  = require('dotenv').config();
const nodemailer = require('nodemailer');
var events = require('events');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
//var expressValidator = require('express-validator');
const { body, validationResult } = require('express-validator');
var mysql = require('mysql');
var hbs = require('hbs');
var fs = require('fs');

var bcrypt = require('bcrypt-nodejs');
var securePin = require('secure-pin');
var passport = require('passport');
var localStrategy = require('passport-local'),Strategy;
var myConnection = require('express-myconnection');
var session = require('express-session');
var MySQLStore = require ('express-mysql-session')(session);
var flash = require('express-flash-messages');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var db = require('./db.js');

console.log('mysql server started')
console.log('no bugs')
console.log('nodejs server started')
console.log('database is good')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//get new partials

var activateTemplate = fs.readFileSync(__dirname + '/views/partials/activate.hbs', 'utf8');
hbs.registerPartial('activate', activateTemplate); 


var messageTemplate = fs.readFileSync(__dirname + '/views/mail/partials/messages.hbs', 'utf8');
hbs.registerPartial('message', messageTemplate); 

//get new partials
var unactivateTemplate = fs.readFileSync(__dirname + '/views/partials/unactivate.hbs', 'utf8');
hbs.registerPartial('unactivate', unactivateTemplate); 

var mainnavTemplate = fs.readFileSync(__dirname + '/views/partials/mainnav.hbs', 'utf8');
hbs.registerPartial('mainnav', mainnavTemplate); 

var noearnTemplate = fs.readFileSync(__dirname + '/views/partials/nomerge.hbs', 'utf8');
hbs.registerPartial('nomerge', noearnTemplate); 

var mainhTemplate = fs.readFileSync(__dirname + '/views/partials/mainh.hbs', 'utf8');
hbs.registerPartial('mainh', mainhTemplate); 

var mainfTemplate = fs.readFileSync(__dirname + '/views/partials/spageh.hbs', 'utf8');
hbs.registerPartial('spageh', mainfTemplate); 

var mainfTemplate = fs.readFileSync(__dirname + '/views/partials/spagenav.hbs', 'utf8');
hbs.registerPartial('spagenav', mainfTemplate); 

const used = process.memoryUsage().heapUsed / 1024 / 1024; console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

var mainfTemplate = fs.readFileSync(__dirname + '/views/partials/mainf.hbs', 'utf8');
hbs.registerPartial('mainf', mainfTemplate); 


var mainfTemplate = fs.readFileSync(__dirname + '/views/partials/spagef.hbs', 'utf8');
hbs.registerPartial('spagef', mainfTemplate); 



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session
var options = {
  waitForConnections: true,
  connectionLimit : 100,
  host: "localhost",
  user: "newuser",
  password: 'user_password',
  database: "newdb"
};

app.use(myConnection(mysql, options, 'pool')); 

var sessionStore = new MySQLStore(options);
  
app.use(session({
  secret: 'keybaby',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  /**cookie:
    #secure: true**/
  }));

  //passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(expressValidator());

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next(); 
});

app.use('/', indexRouter);
app.use('/users', usersRouter); 

passport.use(new localStrategy(function(username, password, done){
	console.log(username);
 console.log(password);
 const db = require('./db.js');

  db.query('SELECT user_id, password FROM user WHERE username = ?', [username], function (err, results, fields){
  	if (err) {done(err)};
  if (results.length === 0){
  		done(null, false, {
  			message: 'Invalid Username'
   });
  }else {
  		console.log(results[0]);
   const hash = results[0].password.toString();
   bcrypt.compare(password, hash, function(err, response){
   		if (response === true){
   			console.log('logged in')
   			return done(null, {user_id: results[0].user_id});
     }else{
     		return done(null, false,{
     			message:'Invalid Password'
       });
      }
    });
   }
 });
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;