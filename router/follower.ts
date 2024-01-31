import express from 'express';
import verifyToken from '../auth';
import {
  updateStatus,
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

// confirm request, block user, delete request will handled from same api
// Note: To unblock user change status to "Rejected" //TODO this thing can be done from frontend side
followerRoute.get('/updateStatus/:senderId/:status', verifyToken, updateStatus);

// get followers of login user
followerRoute.get('/getFollowers', verifyToken, getFollowers);

// get followings of login user
followerRoute.get('/getFollowings', verifyToken, getFollowings);

export default followerRoute;
