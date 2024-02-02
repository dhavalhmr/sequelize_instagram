import { Request, RequestHandler, Response } from 'express';
import passport from '../config/passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Handler from '../utils/Handler';
import db from '../models';
import { ApiError } from '../utils/ErrorHandler';
import { ApiResponse } from '../utils/ResponseHandler';

const generateAccessAndRefreshTokens = async (userId: number) => {
  try {
    const user = await db.User.findByPk(userId);
    const { username, email } = user;
    const accessToken = jwt.sign({ username, email }, 'eugbf7153%*#^', {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ username, email }, '12345678', {
      expiresIn: '1h',
    });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating referesh and access token'
    );
  }
};
export const create = Handler(async (req: Request, res: Response) => {
  try {
    await db.User.create(req.body)
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  } catch (err) {
    return res.status(400).send({ err });
  }
});

export const login: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    console.log('User Authenticated:', user);
    console.log('Session:', req.session); // Log the session
    const {
      username,
      email,
      id,
    }: { username: string; email: string; id: number } = user?.dataValues;

    const generateToken: string = jwt.sign(
      { username, email },
      'eugbf7153%*#^',
      { expiresIn: '1h' }
    );

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      id
    );

    res
      .cookie('access_token', accessToken)
      .cookie('refreshToken', refreshToken);

    return res
      .status(200)
      .send({ message: 'Login successful', accessToken, refreshToken });
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

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Unauthorized request');
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        '12345678'
      ) as JwtPayload;

      const { username, email } = decodedToken;

      const user = await db.User.findOne({ where: { username, email } });

      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, 'Refresh token is expired or used');
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

      return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
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
