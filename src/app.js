const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nocache = require('nocache');

// Route handler related files
const indexRouter = require('./routes');
const eventsRouter = require('./routes/events');
const eventRouter = require('./routes/event');
const configRouter = require('./routes/config');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(nocache());
app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, MERGE, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// mapping URI routes to handlers
app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api/version', indexRouter);
app.use('/api/events', eventsRouter);
app.use('/api/event', eventRouter);
app.use('/api/config', configRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return next(createError(404, 'End Point Not Found'));
});

// error handler
app.use((err, req, res, next) => {
// error handler
  res.status(err.status || 500).json({error: {code: err.status, message: err.message, env: req.app.get('env')}});
});

module.exports = app;
