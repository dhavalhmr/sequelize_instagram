import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from '../config/passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Handler from '../utils/Handler';
import { ApiError } from '../utils/ErrorHandler';
import { ApiResponse } from '../utils/ResponseHandler';
import { createUser, findUser } from '../service/user';
import { generateAccessAndRefreshTokens } from '../utils/JWTHandler';

export const create = Handler(async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ user: await createUser(req.body) });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export const login: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.logIn(user, async (loginErr) => {
      if (loginErr) {
        console.error('Login Error:', loginErr);
        return res.status(500).send({ message: 'Login Failed' });
      }

      console.log('User Authenticated:', user);
      console.log('Session:', req.session); // Log the session
      const {
        username,
        email,
        id
      }: { username: string; email: string; id: number } = user?.dataValues;

      const { refreshToken, accessToken } =
        await generateAccessAndRefreshTokens(id);

      res
        .cookie('access_token', accessToken)
        .cookie('refreshToken', refreshToken);

      return res
        .status(200)
        .send({ message: 'Login successful', accessToken, refreshToken });
    });
  })(req, res, next);
};

export const logout: RequestHandler = Handler((req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).send({ message: 'Error during logout' });
    }
    console.log('User Logged Out:', req.user); // Log the user who logged out
    console.log('Session after Logout:', req.session); // Log the session after logout
    res.clearCookie('access_token');
    return res.status(200).send({ message: 'Logged out successfully' });
  });
});

export const refreshAccessToken = Handler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    console.log('incomingRefreshToken:', incomingRefreshToken);

    if (!incomingRefreshToken) throw new ApiError(401, 'Unauthorized request');

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        '12345678'
      ) as JwtPayload;

      const { username, email } = decodedToken;

      const user = await findUser({ username, email });

      if (!user) throw new ApiError(401, 'Invalid refresh token');

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user.id);

      return res
        .status(200)
        .cookie('access_token', accessToken)
        .cookie('refreshToken', refreshToken)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken },
            'Access token refreshed'
          )
        );
    } catch (error: any) {
      throw new ApiError(401, error?.message || 'Invalid refresh token');
    }
  }
);
