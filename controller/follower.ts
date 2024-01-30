import { RequestHandler } from 'express';
import passport from '../config/passport';
import db from '../models';

export const follow: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId = req?.params?.receiverId;
      const senderId = (req?.user as any)?.dataValues?.id;

      await db.User.findByPk(receiverId)
        .then(async () => {
          const alreadyFollowed = await db.Follow.findAll({
            where: { senderId, receiverId, status: 'Pending' },
          });

          if (alreadyFollowed) {
            return res.status(200).send({ message: 'Already followed' });
          } else {
            await db.Follow.create({
              senderId,
              receiverId,
              status: 'Pending',
            })
              .then((follow: object) => res.status(200).send({ follow }))
              .catch((err: object) => res.status(400).send({ err }));
          }
        })
        .catch((err: any) => res.status(400).send(err));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const pendingRequest: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({
        where: { receiverId: userId, status: 'Pending' },
      })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const confirmRequest: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId = (req?.user as any)?.dataValues?.id;
      const senderId = req?.params?.senderId;

      await db.Follow.update(
        { status: 'Accepted' },
        { where: { receiverId, senderId, status: 'Pending' } }
      )
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const deleteRequest: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId = (req?.user as any)?.dataValues?.id;
      const senderId = req?.params?.senderId;

      await db.Follow.deleteAll({
        where: { receiverId, senderId, status: 'Pending' },
      })
        .on('success', () => {
          res.status(200).send({ message: 'Request has been deleted' });
        })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const getFollowers: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({
        where: { receiverId, status: 'Accepted' },
      })
        .then((result: any) => res.status(200).send({ result }))
        .catch((err: any) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const getFollowings: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({
        where: { senderId: userId, status: 'Accepted' },
      })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};
