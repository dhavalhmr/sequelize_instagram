import db from '../models';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcryptjs from 'bcryptjs';

passport.use(
  new Strategy(
    { usernameField: 'username', passwordField: 'password' },
    async function (username: any, password: any, done: any) {
      try {
        if (!username || !password) throw new Error('Missing credentials');
        const user = await db.User.findOne({ where: { username } });

        if (!user) {
          throw new Error('User not found');
        }

        // Check the password
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
          console.log('Valid authenctication');
          done(null, user);
        } else {
          console.log('Invalid authenctication');
          done(null, null);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(async function (id: any, done: any) {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
