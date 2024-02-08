import jwt from 'jsonwebtoken';
import { ApiError } from './ErrorHandler';
import { findUserById } from '../service/user';

export const generateAccessAndRefreshTokens = async (userId: number) => {
  try {
    const user = await findUserById(userId);
    const { username, email } = user;
    // const expireTimeInSeconds = 1000 * 3; // 3 seconds
    const accessToken = jwt.sign({ username, email }, 'eugbf7153%*#^', {
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign({ username, email }, '12345678', {
      expiresIn: '30d'
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
