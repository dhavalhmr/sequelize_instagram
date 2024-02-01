import express from 'express';
import verifyToken from '../auth';
import { get } from '../controller/user';

const userRouter = express.Router();

userRouter.get('/get', verifyToken, get);

export default userRouter;

/*
  "username": "dhaval_jethava",
  "email": "dj.hmrtech@gmail.com",
  "password": "Dj@123456789",
  "dob": "2000-03-01",
  "bio": "hello",
*/
