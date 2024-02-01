import { RequestHandler, Request, Response } from 'express';
import db from '../models';
import Handler from '../helper/Handler';

type findAll = {
  dataValues: object;
};

export const follow: RequestHandler = Handler(
  async (req: Request, res: Response) => {
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
  }
);

export const pendingRequest: RequestHandler = Handler(
  async (req: Request, res: Response) => {
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
  }
);

export const updateStatus: RequestHandler = Handler(
  async (req: Request, res: Response) => {
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
  }
);

export const getFollowers: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    try {
      const receiverId: string = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({ where: { receiverId, status: 'Accepted' } })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }
);

export const getFollowings: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    try {
      const senderId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({ where: { senderId, status: 'Accepted' } })
        .then((result: object) => res.status(200).send({ result }))
        .catch((err: object) => res.status(400).send({ err }));
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }
);
