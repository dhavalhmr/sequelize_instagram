import express from 'express';
import verifyToken from '../auth';
import passport from '../config/passport';
import db from '../models';

const followerRoute = express.Router();

// get followers of login user
followerRoute.get('/getFollowers', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({
        where: { receiverId: userId, status: 'Accepted' },
      })
        .then((result: any) => res.status(200).send({ result }))
        .catch((err: any) => res.status(400).send({ err }));
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });
});

// get followings of login user
followerRoute.get('/getFollowings', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({
        where: { senderId: userId, status: 'Accepted' },
      })
        .then((result: JSON) => res.status(200).send({ result }))
        .catch((err: JSON) => res.status(400).send({ err }));
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });
});

// get all pending request
followerRoute.get('/getAllPendingRequest', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues?.id;

      await db.Follow.findAll({
        where: { receiverId: userId, status: 'Pending' },
      })
        .then((result: JSON) => res.status(200).send({ result }))
        .catch((err: JSON) => res.status(400).send({ err }));
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });
});

// confirm request
followerRoute.get(
  '/confirmRequest/:senderId',
  verifyToken,
  (req, res, next) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      try {
        const userId = (req?.user as any)?.dataValues?.id;
        const senderId = req?.params?.senderId;

        await db.Follow.update(
          { status: 'Accepted' },
          { where: { receiverId: userId, senderId, status: 'Pending' } }
        )
          .then((result: JSON) => res.status(200).send({ result }))
          .catch((err: JSON) => res.status(400).send({ err }));
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }
    });
  }
);

// send request
followerRoute.post('/follow/:receiverId', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const receiverId = req?.params?.receiverId;
      const userId = (req?.user as any)?.dataValues?.id;

      const alreadyFollowed = await db.Follow.findAll({
        where: { senderId: userId, receiverId, status: 'Pending' },
      });
      if (alreadyFollowed) {
        res.status(200).send({ message: 'Already followed' });
      } else {
        await db.Follow.create({
          senderId: userId,
          receiverId,
          status: 'Pending',
        })
          .then((follow: JSON) => res.status(200).send({ follow }))
          .catch((err: JSON) => res.status(400).send({ err }));
      }
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });
});

export default followerRoute;
