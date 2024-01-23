import express from 'express';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  try {
    res.send('Hello Dhaval');
  } catch (error) {}
});

export default userRouter;
