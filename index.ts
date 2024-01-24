import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import initializedDatabase from './database/index';
import 'dotenv/config';
import routes from './router';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';

const app = express();
const port: number = 2000;

const CorsOptions: {
  origin: string;
  credential: boolean;
} = {
  origin: '*',
  credential: true,
};

app.use(cors(CorsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(
  session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/post', routes.post);

const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.user) return next();
  else
    return res.status(401).json({
      error: 'User not authenticated',
    });
};

app.use(isAuthenticated);

app.listen(port, async () => {
  await initializedDatabase();
  console.log(`Server is running on ${port}`);
});

import 'dotenv/config';

import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';
import SQLiteStore from 'connect-sqlite3';
// import indexRouter from './routes/index';
// import authRouter from './routes/auth';

const SQLiteStoreWithSession = SQLiteStore(session);

app.locals.pluralize = require('pluralize');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStoreWithSession({ db: 'sessions.db', dir: './var/db' }),
  })
);
app.use(passport.authenticate('session'));
// app.use('/', indexRouter);
// app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
