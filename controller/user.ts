import { RequestHandler } from 'express';
import db from '../models';
import passport from '../config/passport';

export const create: RequestHandler = (req, res) => {
  try {
    db.User.create(req.body)
      .then((result: object) => {
        res.status(200).send({ result });
      })
      .catch((err: object) => {
        res.status(400).send({ err });
      });
  } catch (err) {
    res.status(400).send({ err });
  }
};

export const get: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues.id;

      if (userId) {
        const user = await db.User.findByPk(userId, { include: [db?.Post] });
        res.status(200).send({ post: user.dataValues });
      } else {
        res
          .status(400)
          .send({ message: `User does not found by userId:${userId}` });
      }
    } catch (err) {
      res.status(400).send({ err });
    }
  })(req, res, next);
};
