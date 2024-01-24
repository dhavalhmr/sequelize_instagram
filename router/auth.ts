import express from 'express';
import passport from '../config/passport';

const authRouter = express.Router();

authRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send({ message: 'Login successful', user: req.user });
});

authRouter.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send({ message: 'Error during logout' });

    res.send({ message: 'Logged out successfully' });
  });
});

export default authRouter;
