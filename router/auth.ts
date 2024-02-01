import express from 'express';
import { create, login, logout } from '../controller/auth';
import passport from '../config/passport';

const authRouter = express.Router();

authRouter.post('/create', create);

authRouter.post('/login', login);

authRouter.get('/logout', logout);

export default authRouter;
