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
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/post', routes.post);  

const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({
      error: 'User not authenticated',
    });
  }
};

app.use(isAuthenticated);

app.listen(port, async () => {
  await initializedDatabase();
  console.log(`Server is running on ${port}`);
});
