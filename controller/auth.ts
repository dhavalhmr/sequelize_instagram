import { Request, RequestHandler, Response } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';
import Handler from '../helper/Handler';
import db from '../models';

export const create = Handler(async (req: Request, res: Response) => {
  try {
    await db.User.create(req.body)
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  } catch (err) {
    return res.status(400).send({ err });
  }
});

export const login: RequestHandler = async (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      console.error('Passport Authentication Error:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (!user) {
      console.error('Authentication Failed:', info);
      return res.status(401).send({ message: 'Authentication Failed' });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login Error:', loginErr);
        return res.status(500).send({ message: 'Login Failed' });
      }
      console.log('User Authenticated:', user);
      console.log('Session:', req.session); // Log the session
      const { username, email }: { username: string; email: string } =
        user?.dataValues;

      const generateToken: string = jwt.sign(
        { username, email },
        'eugbf7153%*#^'
      );

      res.cookie('access_token', generateToken);

      return res
        .status(200)
        .send({ message: 'Login successful', generateToken });
    });
  })(req, res, next);
};

export const logout: RequestHandler = Handler((req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).send({ message: 'Error during logout' });
    }
    console.log('User Logged Out:', req.user); // Log the user who logged out
    console.log('Session after Logout:', req.session); // Log the session after logout
    res.clearCookie('access_token');
    return res.status(200).send({ message: 'Logged out successfully' });
  });
});
