var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var covidRouter = require('./routes/covid');
var trafficRouter = require('./routes/traffic');
var mobilityRouter = require('./routes/mobility');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT, GET');
    next();
});

app.use('/', covidRouter);
app.use('/covid', covidRouter);
app.use('/traffic', trafficRouter);
app.use('/mobility', mobilityRouter);

module.exports = app;
