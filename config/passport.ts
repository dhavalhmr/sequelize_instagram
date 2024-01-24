import db from '../models';
import passport from 'passport';
import { Strategy } from 'passport-local';

passport.use(
  new Strategy(
    { usernameField: 'username', passwordField: 'password' },
    async function (username: any, password: any, done: any) {
      try {
        const matchUser = await db.User.findOne({ username, password });
        if (matchUser.dataValues) {
        } else {
          done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, matchUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function (id: any, done: any) {
  db.User.findByPk(id).then(function (user: any) {
    done(null, user);
  });
});

export default passport;
