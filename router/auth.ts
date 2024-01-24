import express from 'express';
import passport from '../config/passport';

const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {
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
      return res.status(200).send({ message: 'Login successful' });
    });
  })(req, res, next);
});

authRouter.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).send({ message: 'Error during logout' });
    }
    console.log('User Logged Out:', req.user); // Log the user who logged out
    console.log('Session after Logout:', req.session); // Log the session after logout
    res.send({ message: 'Logged out successfully' });
  });
});

export default authRouter;
