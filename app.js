var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

app.use('/', indexRouter);
app.use('/api/phonebooks', indexRouter)
app.use('/users', usersRouter);

module.exports = app;
