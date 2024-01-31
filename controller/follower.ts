import { RequestHandler } from 'express';
import passport from '../config/passport';
import db from '../models';

type findAll = {
  dataValues: object;
};

export const follow: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId: string = req?.params?.receiverId;
      const senderId: string = (req?.user as any)?.dataValues?.id;

      if (receiverId === senderId)
        return res.status(400).send({ message: 'Invalid userId' });

      await db.User.findByPk(receiverId)
        .then(async () => {
          const alreadyFollowed: findAll = await db.Follow.findAll({
            where: { senderId, receiverId, status: 'Pending' },
          });

          if (alreadyFollowed.dataValues) {
            return res.status(200).send({ message: 'Already followed' });
          } else {
            await db.Follow.create({ senderId, receiverId, status: 'Pending' })
              .then((follow: object) => res.status(200).send({ follow }))
              .catch((err: object) => res.status(400).send({ err }));
          }
        })
        .catch((err: object) => res.status(400).send(err));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const pendingRequest: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId: string = (req?.user as any)?.dataValues?.id; // login userId will be receiverId

      await db.Follow.findAll({ where: { receiverId, status: 'Pending' } })
        .then((result: []) => {
          if (result.length > 0) return res.status(200).send({ result });
          else return res.status(200).send({ message: 'No Pending Request' });
        })
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const updateStatus: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const status: string = req?.params?.status;
      const receiverId: string = (req?.user as any)?.dataValues?.id;
      const senderId: string = req?.params?.senderId;

      if (status === 'Accepted') {
        await db.Follow.update(
          { status },
          { where: { receiverId, senderId, status: 'Pending' } }
        )
          .then((result: object) => res.status(200).send({ result }))
          .catch((err: object) => res.status(400).send({ err }));
      }
      if (status === 'Blocked' || 'Rejected') {
        await db.Follow.update({ status }, { where: { receiverId, senderId } })
          .then((result: object) => res.status(200).send({ result }))
          .catch((err: object) => res.status(400).send({ err }));
      }
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const getFollowers: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId: string = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({ where: { receiverId, status: 'Accepted' } })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};

export const getFollowings: RequestHandler = (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const senderId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({ where: { senderId, status: 'Accepted' } })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  })(req, res, next);
};
