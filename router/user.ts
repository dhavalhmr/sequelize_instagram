import express from 'express';
import db from '../models';
import passport from '../config/passport';
import verifyToken from '../auth';

const userRouter = express.Router();

userRouter.post('/create', (req, res) => {
  try {
    db.User.create(req.body)
      .then((result: object) => {
        res.send({ status: 200, result });
      })
      .catch((err: object) => {
        res.send({ status: 400, err });
      });
  } catch (err) {
    res.send({ status: 400, err });
  }
});

userRouter.get('/get/:userId', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const userId = (req?.user as any)?.dataValues.id;

      if (userId) {
        const user = await db.User.findByPk(userId, { include: [db?.Post] });
        res.send({ status: 200, post: user.dataValues });
      } else {
        res.send({
          status: 400,
          message: `User does not found by userId:${userId}`,
        });
      }
    } catch (err) {
      res.send({ status: 400, err });
    }
  })(req, res, next);
});

export default userRouter;

/*
  "username": "dhaval_jethava",
  "email": "dj.hmrtech@gmail.com",
  "password": "Dj@123456789",
  "dob": "2000-03-01",
  "bio": "hello",
*/
