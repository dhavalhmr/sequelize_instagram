import express from 'express';
import { create, login, logout, refreshAccessToken } from '../controller/auth';

const authRouter = express.Router();

authRouter.post('/create', create);

authRouter.post('/login', login);

authRouter.post('/refresh-token', refreshAccessToken);

authRouter.get('/logout', logout);

export default authRouter;
