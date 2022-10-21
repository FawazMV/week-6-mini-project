var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var signupRouter = require('./routes/signup');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
const userRouter = require('./routes/user')
const fileUpload = require('express-fileupload')
const db = require('./config/connection')
var app = express();

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 100000 * 60 }
}))

app.use((req, res, next) => {
  res.set(
    "Cache-control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ layoutsDir: __dirname + '/views/layouts', extname: 'hbs', defaultLayout: 'layout', partialsDir: __dirname + '/views/partials/' }))

db.connect((err) => {
  if (err) console.log('connection err'+err);
  else console.log('database connected')
})


app.use(fileUpload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/signup', signupRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
