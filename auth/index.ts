import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { findUser } from '../service/user';

const verifyToken = async (req: any, res: Response, next: any) => {
  try {
    // Just for we don't have to enter token in bearer headers so we saving in cookie once we completed this project we going get this same thing from req.headers
    // const jwtToken: string | undefined = req?.headers?.cookie
    //   ?.split('access_token=')[1]
    //   .split(';')[0];
    // const jwtToken: string | undefined = req?.headers?.authorization?.split(' ')[1];
    const jwtToken = req.headers['jwt-token-auth'] as string | undefined;

    console.log(jwtToken);

    if (!jwtToken) throw new Error('Please signIn first');

    const verifiedToken = await jwt.verify(jwtToken, 'eugbf7153%*#^');
    console.log('verifyToken  verifiedToken:', verifiedToken);

    const { username, email } = verifiedToken as JwtPayload;

    const userData = await findUser({ username, email });

    if (!userData) throw new Error('User not found');
    else next();
  } catch (error) {
    return res.status(400).send({ Error:error });
  }
};

export default verifyToken;
