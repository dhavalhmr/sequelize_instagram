import { Request, RequestHandler, Response } from 'express';
import db from '../models';
import Handler from '../helper/Handler';

export const get: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const userId = (req?.user as any)?.dataValues.id;

    if (userId) {
      const user = await db.User.findByPk(userId, { include: [db?.Post] });
      return res.status(200).send({ post: user });
    } else {
      return res
        .status(400)
        .send({ message: `User does not found by userId:${userId}` });
    }
  }
);
