import { RequestHandler, Request, Response } from 'express';
import Handler from '../utils/Handler';
import { findUserById } from '../service/user';
import {
  getFollower,
  getFollowing,
  getPendingRequest,
  sendFollowRequest,
  updateRequestStatus
} from '../service/follow';

export const follow: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const receiverId: string = req?.params?.receiverId;
    const senderId: string = (req?.user as any)?.dataValues?.id;

    if (receiverId === senderId)
      return res.status(400).json({ message: 'Invalid userId' });

    await findUserById(receiverId)
      .then(async () => {
        await sendFollowRequest(senderId, receiverId)
          .then((follow: object) => res.status(200).json({ follow }))
          .catch((err: any) => res.status(400).json({ message: err.message }));
      })
      .catch((err: any) => res.status(400).json({ message: err.message }));
  }
);

export const pendingRequest: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const receiverId: string = (req?.user as any)?.dataValues?.id; // login userId will be receiverId

    await getPendingRequest(receiverId)
      .then((result: Array<object>) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);

export const updateStatus: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const status: string = req?.params?.status;
    const receiverId: string = (req?.user as any)?.dataValues?.id;
    const senderId: string = req?.params?.senderId;

    await updateRequestStatus(receiverId, senderId, status)
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);

export const getFollowers: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const receiverId: string = (req?.user as any)?.dataValues?.id;

    await getFollower(receiverId)
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);

export const getFollowings: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const senderId = (req?.user as any)?.dataValues?.id;

    await getFollowing(senderId)
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);
