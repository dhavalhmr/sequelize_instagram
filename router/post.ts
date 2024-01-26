import express from 'express';
import db from '../models';
import passport from '../config/passport';
import verifyToken from '../auth';

const postRouter = express?.Router();

postRouter.use((req, res, next) => {
  req.user ? next() : res.send(401);
});

postRouter.post('/create', verifyToken, (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    try {
      db.Post.create({
        userId: (req?.user as any)?.dataValues?.id,
        ...req?.body,
      })
        .then((result: any) => res.send({ status: 200, result }))
        .catch((err: any) => res.send({ status: 400, err }));
    } catch (err) {
      res.send({ status: 400, err });
    }
  })(req, res, next);
});

postRouter.put('/update/:postId', verifyToken, async (req, res) => {
  try {
    const postId = req?.params?.postId;

    const userId = (req?.user as any)?.dataValues.id;

    const oldPost = await db?.Post?.findOne({ where: { id: postId } });

    if (userId === oldPost.dataValues.userId) {
      const updatePost = await db?.Post?.update(req.body, {
        where: { id: oldPost.dataValues.id },
      });

      if (updatePost[0] === 1) {
        const newPost = await db?.Post?.findOne({ where: { id: postId } });
        return res.send({ status: 200, result: newPost.dataValues });
      }
    } else {
      return res.send({
        status: 400,
        message: `Post with ${postId} not updated`,
      });
    }
  } catch (err: any) {
    res.send({ status: 400, err: err.message });
  }
});

export default postRouter;

/*
    "description": "first photo",
    "photoUpload": "ubuwhfiwhwbjufwgurfh",
    "userId": 1,
    "like": ["1"],
    "comment": ["userId: "1"]
*/
