import express from 'express';
import db from '../models';
import passport from '../config/passport';

const postRouter = express?.Router();

postRouter.post('/create', (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    try {
      console.log('session:', req.session);
      db.Post.create(req?.body)
        .then((result: any) => res.send({ status: 200, result }))
        .catch((err: any) => res.send({ status: 400, err }));
    } catch (err) {
      res.send({ status: 400, err });
    }
  })(req, res, next);
});
postRouter.use((req, res, next) => {
  console.log('Checking req.user ...');
  console.log('req.user:', req.user);
  req.user ? next() : res.send(401);
});

postRouter.get('/:postId', async (req, res) => {
  try {
    const postId = req?.params?.postId;
    const post = await db?.Post?.findByPk(postId, { include: [db?.User] });

    if (post?.dataValues)
      return res.send({ status: 200, result: post.dataValues });
    else
      return res.send({
        status: 400,
        message: `Post with ${postId} not found`,
      });
  } catch (err) {
    res.send({ status: 400, err });
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
