import express from 'express';
import verifyToken from '../auth';
import passport from '../config/passport';

const followerRoute = express.Router();

followerRoute.get('/get', verifyToken, (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    try {
    } catch (error) {
        res
    }
  });
});

export default followerRoute;
