import express from 'express';
import db from '../models';

const userRouter = express.Router();

userRouter.get('/create', (req, res) => {
  try {
    console.log('db:', db);
    res.send('Hello Dhaval');
  } catch (error) {}
});

export default userRouter;
