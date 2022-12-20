require('dotenv').config(); /* Loading the environment variables from the .env file. */
const createError = require('http-errors');
const express = require('express');
const passport = require('passport'); /* Requiring the passport module. */
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); /* A middleware that allows cross-origin requests. */

/* Requiring the REST API model to the app. */
require('./app_api/models/database');
//Requiere estrategia después de la definición del modelo
require('./app_api/config/passport');

const serverRouter = require('./app_server/routes/serverRouter');
const apiRouter = require('./app_api/routes/api_router');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//Inicializa Passport y agrega el middleware de passport
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

/* This is telling the app to use the serverRouter for any requests to the server. */
app.use('/', serverRouter);
/* Telling the app to use the apiRouter for any requests to the REST API */
app.use('/api', apiRouter);

/* This is a catch-all route that will send the index.html file to the client. */
app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
 });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

/* This is a middleware that handles the error when the user is not authorized to access a route. */
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
      console.log('Error no autorizado');
      res
          .status(401)
          .json({ "message": err.name + ": " + err.message });
  }
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
