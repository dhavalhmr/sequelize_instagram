import { Request, RequestHandler, Response } from 'express';
import db from '../models';
import Handler from '../utils/Handler';

export const get: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const userId = (req?.user as any)?.dataValues.id;
    console.log('userId:', userId);

    if (userId) {
      const user = await db.User.findByPk(userId, {
        include: [
          {
            model: db?.Post,
            as: 'posts',
            include: [
              {
                model: db.LikeAndComment,
                as: 'like',
                required: false,
                where: { type: 'Like' },
                attributes: { exclude: ['id', 'comment', 'createdAt', 'type'] },
                include: [
                  {
                    model: db.User,
                    as: 'user',
                    attributes: ['username', 'email'],
                  },
                ],
              },
              {
                model: db.LikeAndComment,
                as: 'comment',
                required: false,
                where: { type: 'Comment' },
                attributes: {
                  exclude: ['id', 'like', 'createdAt', 'type', 'postId'],
                },
                include: [
                  {
                    model: db.User,
                    as: 'user',
                    attributes: ['username', 'email'],
                  },
                ],
              },
            ],
          },
          {
            model: db?.Follow,
            as: 'follower',
            required: false,
            attributes: { exclude: ['receiverId', 'createdAt'] },
            where: { status: 'Accepted' },
            include: {
              model: db.User,
              as: 'sender',
              attributes: {
                exclude: [
                  'email',
                  'password',
                  'dob',
                  'bio',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          },
          {
            model: db?.Follow,
            as: 'following',
            required: false,
            attributes: { exclude: ['senderId', 'createdAt'] },
            where: { status: 'Accepted' },
            include: {
              model: db.User,
              as: 'receiver',
              attributes: {
                exclude: [
                  'email',
                  'password',
                  'dob',
                  'bio',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          },
        ],
        attributes: {
          exclude: ['password'],
        },
      });
      console.log('user:', user);
      return res.status(200).json({ User: user });
    } else {
      return res
        .status(400)
        .send({ message: `User does not found by userId:${userId}` });
    }
  }
);
