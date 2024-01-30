import { RequestHandler } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

export const login: RequestHandler = (req, res, next) => {
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
      const { username, email } = user?.dataValues;
      const generateToken = jwt.sign({ username, email }, 'eugbf7153%*#^');
      res.cookie('access_token', generateToken);
      return res.status(200).send({ message: 'Login successful' });
    });
  })(req, res, next);
};

export const logout: RequestHandler = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).send({ message: 'Error during logout' });
    }
    console.log('User Logged Out:', req.user); // Log the user who logged out
    console.log('Session after Logout:', req.session); // Log the session after logout
    res.clearCookie('access_token');
    res.status(200).send({ message: 'Logged out successfully' });
  });
};
