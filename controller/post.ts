import { Request, RequestHandler, Response } from 'express';
import db from '../models';
import Handler from '../utils/Handler';

type Post = {
  dataValues: { id: string; userId: string };
  like: { userId: Array<string> };
};
export const create: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    await db.Post.create({
      userId: (req?.user as Post)?.dataValues?.id,
      ...req?.body,
    })
      .then((result: object) => res.status(200).send({ result }))
      .catch((err: object) => res.status(400).send({ err }));
  }
);

export const get: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const postId: string = req?.params?.postId;
    const userId: string = (req?.user as any)?.dataValues.id;

    const post: Post = await db.Post.findByPk(postId, {
      include: [db?.User],
    });

    if (post.dataValues) {
      res.status(200).send({ post: post.dataValues });
    } else {
      res
        .status(400)
        .send({ message: `User does not have post by postId:${postId}` });
    }
  }
);

export const update: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const postId: string = req?.params?.postId;
    const userId: string = (req?.user as any)?.dataValues.id;

    const oldPost: Post = await db?.Post?.findOne({ where: { id: postId } });

    if (userId === oldPost.dataValues.userId) {
      // checking person who have uploaded post is updating post
      const updatePost: Array<number> = await db?.Post?.update(req.body, {
        where: { id: oldPost.dataValues.id },
      });

      if (updatePost[0] === 1) {
        const newPost = await db?.Post?.findOne({ where: { id: postId } });
        return res.status(200).send({ result: newPost.dataValues });
      }
    } else {
      return res
        .status(400)
        .send({ message: `Post with ${postId} not updated` });
    }
  }
);

export const like: RequestHandler = Handler(
  async (req: Request, res: Response) => {
    const { postId, type } = req?.params;
    const userId = (req?.user as any)?.dataValues.id;

    const post: Post = await db?.Post?.findOne({ where: { id: postId } });

    if (post) {
      if (type === 'Like') {
        // Check if the user has already liked the post

        const like = await db.LikeAndComment.findOne({
          where: {
            type: 'Like',
            postId,
            userId,
            comment: null,
          },
        });

        if (!like) {
          const newLike = await db.LikeAndComment.create({
            type: 'Like',
            postId,
            userId,
          });

          return res.status(200).json({ newLike });
        }
        // Remove like ID from the like table
        await like.destroy();
        return res.status(200).json({ message: 'Dislike successfully' });
      }

      if (type === 'Comment') {
        const { comment } = req?.body;

        if (!comment) {
          return res.status(400).json('Message is required to add comment');
        }
        await db.LikeAndComment.create({
          type: 'Comment',
          postId,
          userId,
          comment,
        });
      }
      const likeAndComment = await db.LikeAndComment.findOne({
        where: { type, postId, userId },
        order: [['createdAt', 'DESC']],
      });
      return res.status(200).send({ likeAndComment });
    } else {
      return res
        .status(400)
        .json({ message: `Post with ID ${postId} not found.` });
    }
  }
);
