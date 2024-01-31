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
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import { config } from './config';
interface ConfigType {
  name: string;
  username: string;
  password: string;
  host: string;
  port: string;
  dialect: string;
}

const app = express();
const port: number = 2000;
const { name, username, password, host } = config.dbCredential as ConfigType;

const CorsOptions: {
  origin: string;
  credential: boolean;
} = {
  origin: '*',
  credential: true,
};

const pgPool = new pg.Pool({
  // postgresql://USER:PASSWORD@HOST:PORT/DATABASE
  connectionString: `postgresql://${username}:${password}@${host}:${config.dbCredential.port}/${name}`,
});

app.use(cors(CorsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: config.dbCredential.session,
    resave: true,
    saveUninitialized: true,
    store: new (connectPgSimple(session))({
      pool: pgPool,
    }),
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/post', routes.post);
app.use('/follower', routes.follow);

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  else return res.status(401).json({ error: 'User not authenticated' });
}

app.use(isAuthenticated);

app.listen(port, async () => {
  await initializedDatabase();
});
