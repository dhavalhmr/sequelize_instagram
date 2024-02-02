import { Request, RequestHandler, Response } from 'express';
import db from '../models';
import Handler from '../utils/Handler';

export const get: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const userId = (req?.user as any)?.dataValues.id;

    if (userId) {
      const user = await db.User.findByPk(userId, {
        include: [{ model: db?.Post, as: 'posts' }, { model: db?.Follow }],
      });
      return res.status(200).json({ post: user.dataValues });
    } else {
      return res
        .status(400)
        .send({ message: `User does not found by userId:${userId}` });
    }
  }
);
