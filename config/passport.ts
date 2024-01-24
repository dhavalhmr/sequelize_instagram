import db from '../models';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(
  new LocalStrategy(async function (username: any, password: any, done: any) {
    try {
      const user = await db.User.findOne({ where: { username: username } });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const passVal = user.validPassword(password);
      if (!passVal) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function (id: any, done: any) {
  db.User.findByPk(id).then(function (user: any) {
    done(null, user);
  });
});
