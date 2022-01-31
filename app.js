var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./controllers/db')

var indexRouter = require('./routes/index');
var covidRouter = require('./routes/covid');
var trafficRouter = require('./routes/traffic');
var mobilityRouter = require('./routes/mobility');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT, GET');
    next();
});

app.use('/api/covid', covidRouter);
app.use('/api/traffic', trafficRouter);
app.use('/api/mobility', mobilityRouter);

/** ce se ne ujema z url-jem za API, ga bo preusmerilo na Angular frontend **/
/** todo **/
//const distFolder = isProduction?:'build';
app.use(express.static(path.join(__dirname, 'public','dist', 'public')));
app.use("/*",function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'dist', 'public', 'index.html'));
});


// Obvladovanje napak zaradi avtentikacije
app.use((err, req, res, next) => {
    if (err.name == "UnauthorizedError") {
        res.status(401).json({"sporocilo": err.name + ": " + err.message});
    }
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


app.use(function(req, res, next) {
    next(createError(404));
});

module.exports = app;
