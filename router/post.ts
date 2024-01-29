import express from 'express';
import db from '../models';
import passport from '../config/passport';
import verifyToken from '../auth';

const postRouter = express?.Router();

postRouter.use((req, res, next) => {
  req.user ? next() : res.send(401);
});

postRouter.post('/create', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      await db.Post.create({
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

postRouter.get('/get/:postId', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const postId = req?.params?.postId;

      const userId = (req?.user as any)?.dataValues.id;

      const post = await db.Post.findByPk(postId, { include: [db?.User] });

      if (post.dataValues.userId === userId) {
        res.send({ status: 200, post: post.dataValues });
      } else {
        res.send({
          status: 400,
          message: `User does not have post by postId:${postId}`,
        });
      }
    } catch (err) {
      res.send({ status: 400, err });
    }
  })(req, res, next);
});

postRouter.put('/update/:postId', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const postId = req?.params?.postId;

      const userId = (req?.user as any)?.dataValues.id;

      const oldPost = await db?.Post?.findOne({ where: { id: postId } });

      if (userId === oldPost.dataValues.userId) {
        // checking person who have uploaded post is updating post
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
  })(req, res, next);
});

postRouter.put('/like/:postId', verifyToken, (req, res, next) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    try {
      const postId = req?.params?.postId;
      const userId = (req?.user as any)?.dataValues.id;

      const post = await db?.Post?.findOne({ where: { id: postId } });

      if (post) {
        // Check if the user has already liked the post
        const alreadyLiked = post.like.includes(userId);

        if (!alreadyLiked) {
          // Add user ID to the like array
          post.like.push(userId);
          await db.Post.update({ like: post.like }, { where: { id: postId } });
        } else {
          // Remove user ID from the like array
          post.like = post.like.filter((id: number) => id !== userId);
          await db.Post.update({ like: post.like }, { where: { id: postId } });
        }

        // Save the updated post
        await post.save();

        const updatedPost = await db.Post.findOne({ where: { id: postId } });
        // Return the updated post
        return res.status(200).json({ result: updatedPost.dataValues });
      } else {
        return res
          .status(400)
          .json({ message: `Post with ID ${postId} not found.` });
      }
    } catch (err: any) {
      res.send({ status: 400, err: err.message });
    }
  })(req, res, next);
});

export default postRouter;

/*
    "description": "first photo",
    "photoUpload": "ubuwhfiwhwbjufwgurfh",
    "userId": 1,
    "like": ["1"],
    "comment": ["userId: "1"]
*/
