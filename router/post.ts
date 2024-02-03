import express from 'express';
import verifyToken from '../auth';
import { create, get, like, update } from '../controller/post';

const postRouter = express?.Router();

postRouter.use((req, res, next) => {
  if (req.user) {
    console.log('req.user============>:', (req.user as any).dataValues);
    next();
  } else {
    return res.status(401).json({ message: 'User Not Authenticate' });
  }
});

postRouter.post('/create', create);

postRouter.get('/get/:postId', verifyToken, get);

postRouter.put('/update/:postId', verifyToken, update);

postRouter.put('/:postId/:type(Like|Comment)', verifyToken, like);

postRouter.post('/comment/:postId');

export default postRouter;

/*
    "description": "first photo",
    "photoUpload": "ubuwhfiwhwbjufwgurfh",
    "userId": 1,
    "like": ["1"],
    "comment": ["userId: "1"]
*/
