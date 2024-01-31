import express from 'express';
import verifyToken from '../auth';
import { create, get } from '../controller/user';

const userRouter = express.Router();

userRouter.post('/create', create);

userRouter.get('/get', verifyToken, get);

export default userRouter;

/*
  "username": "dhaval_jethava",
  "email": "dj.hmrtech@gmail.com",
  "password": "Dj@123456789",
  "dob": "2000-03-01",
  "bio": "hello",
*/
