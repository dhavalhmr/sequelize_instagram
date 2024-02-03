import { RequestHandler, Request, Response } from 'express';
import db from '../models';
import Handler from '../utils/Handler';

type findAll = {
  dataValues: object;
};

export const follow: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const receiverId: string = req?.params?.receiverId;
    const senderId: string = (req?.user as any)?.dataValues?.id;

    if (receiverId === senderId)
      return res.status(400).send({ message: 'Invalid userId' });

    await db.User.findByPk(receiverId)
      .then(async () => {
        const alreadyFollowed: Array<findAll> = await db.Follow.findAll({
          where: { senderId, receiverId, status: 'Pending' },
        });

        if (alreadyFollowed.length > 0 && alreadyFollowed[0].dataValues) {
          return res.status(200).send({ message: 'Already followed' });
        }

        if (alreadyFollowed.length === 0) {
          await db.Follow.create({ senderId, receiverId, status: 'Pending' })
            .then((follow: object) => res.status(200).send({ follow }))
            .catch((err: object) => res.status(400).send({ err }));
        }
      })
      .catch((err: object) => res.status(400).send(err));
  }
);

export const pendingRequest: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const receiverId: string = (req?.user as any)?.dataValues?.id; // login userId will be receiverId

    await db.Follow.findAll({ where: { receiverId, status: 'Pending' } })
      .then((result: []) => {
        if (result.length > 0) return res.status(200).send({ result });
        else return res.status(200).send({ message: 'No Pending Request' });
      })
      .catch((err: object) => res.status(400).send({ err }));
  }
);

export const updateStatus: RequestHandler = Handler(
  async (req: Request, res: Response) => {
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
    if (status === 'Blocked' || status === 'Rejected') {
      await db.Follow.update({ status }, { where: { receiverId, senderId } });
    }
  }
);

export const getFollowers: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const receiverId: string = (req?.user as any)?.dataValues?.id;

    await db.Follow.findAll({
      attributes: ['senderId', 'status'],
      where: { receiverId, status: 'Accepted' },
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
    })
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);

export const getFollowings: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const senderId = (req?.user as any)?.dataValues?.id;

    await db.Follow.findAll({
      attributes: ['receiverId', 'status'],
      where: { senderId, status: 'Accepted' },
    })
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);
