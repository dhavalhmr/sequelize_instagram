import express from 'express';
import db from '../models';

const userRouter = express.Router();

userRouter.post('/create', (req, res) => {
  try {
    db.User.create(req.body)
      .then((result: object) => {
        res.send({ status: 200, result });
      })
      .catch((err: object) => {
        res.send({ status: 400, err });
      });
  } catch (err) {
    res.send({ status: 400, err });
  }
});

export default userRouter;

/*
  username: 'dhaval_jethava',
  email: 'dj.hmrtech@gmail.com',
  password: 'Dj@123456789',
  dob: '2000-03-01',
  bio: 'hello',
*/
