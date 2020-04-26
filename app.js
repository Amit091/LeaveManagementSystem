const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const validator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

require('dotenv').config({ path: __dirname + '/.env' })


// app.set('view engine', 'ejs');
app.set('view engine', 'pug');
// view engine setup
app.set('views', path.join(__dirname, 'views'));


// app.use(
//   morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//   })
// );
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//use middleware to serve static files
app.use(express.static('public'));
//use middleware to serve static files
app.use('/static', express.static('public'));

app.enable('view cache', false)


//express session
app.use(session({
  secret: 'keyboard',
  resave: false,
  saveUninitialized: false,
  duration: 1000 * 1
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//flash message and CORS
app.use(flash());
app.use(cors());

//global variable for message type
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.error = req.flash('error');
  next();
});

//validators
app.use(validator({
  errorFormatter: function (param, msg, value) {
    var namescape = param.split('.'),
      root = namescape.shift(),
      formParam = root;
    while (namescape.length) {
      formParam += '[' + namescape.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}));

//Global value for app
app.all('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//loading route
const indexRouter = require('./routes/indexRoute');
const leaveTypeRouter = require('./routes/leaveTypeRoute');
const holidayRoute = require('./routes/holidayRoute');
const applyLeaveRouter = require('./routes/applyLeaveRoute');
const usersRouter = require('./routes/userRoute');
const ajaxRouter = require('./routes/apiRoute');
const calenderRouter = require('./routes/calenderRoute');

//Routing
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/leavetype', leaveTypeRouter);
app.use('/holiday', holidayRoute);
app.use('/applyleave', applyLeaveRouter);
app.use('/ajax', ajaxRouter);
app.use('/calender', calenderRouter);


// //catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  let error = err.status
  console.log('error', err);

  res.render('base/error404', error);
});

module.exports = app;