var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//azure app insight linkup
var appInsights = require('applicationinsights');
appInsights.setup('c664a96e-e368-4ae5-b386-be23da5efcd6');
appInsights.start();
//-----

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//app insight
app.use('/problem', function() {
  throw new Error('Something is wrong');
});

// catch 404 and forward to error handler
 app.use(function(req, res, next) {
   next(createError(404));
 });



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //app insight
  appInsights.defaultClient.trackException({exception: err});

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
