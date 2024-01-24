import express from 'express';
import crypto from 'crypto';
import db from '../models';
import passport from '../config/passport';

// const LocalStrategy = require('passport-local');

const authRouter = express.Router();

// authRouter.get('/login', passport.authenticate('local'), (req, res) => {
//   res.status(200).send({ message: 'Logged In Successful' });
// });

// authRouter.get('/logout', (req: any, res: any) => {
//   req.logout();
//   res.send({ message: 'Logged out' });
// });

// authRouter.post('/logout', function(req, res, next) {
//   req.logout(function(err) {
//     // if (err) { return next(err); }
//     // res.redirect('/');
//     res.send({ message: 'Logged out' });
//   });
// });

// passport.use(
//   new LocalStrategy(function verify(username: any, password: any, cb: any) {
//     db.get(
//       'SELECT * FROM users WHERE username = ?',
//       [username],
//       function (err: any, row: any) {
//         if (err) {
//           return cb(err);
//         }
//         if (!row) {
//           return cb(null, false, {
//             message: 'Incorrect username or password.',
//           });
//         }

//         crypto.pbkdf2(
//           password,
//           row.salt,
//           310000,
//           32,
//           'sha256',
//           function (err, hashedPassword) {
//             if (err) {
//               return cb(err);
//             }
//             if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//               return cb(null, false, {
//                 message: 'Incorrect username or password.',
//               });
//             }
//             return cb(null, row);
//           }
//         );
//       }
//     );
//   })
// );

authRouter.get('/login', passport.authenticate('local'), async (req, res) => {
  res.send({ status: 200, message: 'sucessfull' });
});
export default authRouter;
