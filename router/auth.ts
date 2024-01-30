import express from 'express';
import { login, logout } from '../controller/auth';

const authRouter = express.Router();

authRouter.post('/login', login);

authRouter.get('/logout', logout);

export default authRouter;
