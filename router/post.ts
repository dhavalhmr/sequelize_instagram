import express from 'express';
import verifyToken from '../auth';
import { create, get, like, update } from '../controller/post';

const postRouter = express?.Router();

postRouter.use((req, res, next) => {
  req.user ? next() : res.send(401);
});

postRouter.post('/create', verifyToken, create);

postRouter.get('/get/:postId', verifyToken, get);

postRouter.put('/update/:postId', verifyToken, update);

postRouter.put('/like/:postId', verifyToken, like);

export default postRouter;

/*
    "description": "first photo",
    "photoUpload": "ubuwhfiwhwbjufwgurfh",
    "userId": 1,
    "like": ["1"],
    "comment": ["userId: "1"]
*/
