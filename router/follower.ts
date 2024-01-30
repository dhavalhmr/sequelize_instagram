import express from 'express';
import verifyToken from '../auth';
import {
  confirmRequest,
  deleteRequest,
  follow,
  getFollowers,
  getFollowings,
  pendingRequest,
} from '../controller/follower';

const followerRoute = express.Router();

// send request
followerRoute.post('/follow/:receiverId', verifyToken, follow);

// get all pending request
followerRoute.get('/getAllPendingRequest', verifyToken, pendingRequest);

// confirm request
followerRoute.get('/confirmRequest/:senderId', verifyToken, confirmRequest);

// delete request
// by swipping value of receiverId and senderId from frontend this api can call for receiver side and also sender side
followerRoute.get('/deleteRequest/:senderId', verifyToken, deleteRequest);

// get followers of login user
followerRoute.get('/getFollowers', verifyToken, getFollowers);

// get followings of login user
followerRoute.get('/getFollowings', verifyToken, getFollowings);

export default followerRoute;
