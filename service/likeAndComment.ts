import db from '../models';

export const addLikeOrComment = (
  type: string,
  postId: string,
  userId: string
) => db.LikeAndComment.create({ type, postId, userId });
