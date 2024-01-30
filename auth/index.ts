import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../models';

const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const jwtToken = req?.headers?.cookie
      ?.split('access_token=')[1]
      .split(';')[0];

    if (!jwtToken) throw new Error('Please signIn first');

    const verifiedToken = await jwt.verify(jwtToken, 'eugbf7153%*#^');

    const { username, email } = verifiedToken as JwtPayload;

    const userData = await db.User.findOne({ where: { username, email } });

    if (!userData) throw new Error('User not found');
    else next();
  } catch (error) {
    res.status(400).send({ error });
  }
};

export default verifyToken;
