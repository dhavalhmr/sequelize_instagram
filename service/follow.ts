import db from '../models';

export const sendFollowRequest = async (
  receiverId: string,
  senderId: string,
  status: string = 'Pending'
) => {
  const find = await db.Follow.findAll({
    where: { receiverId, senderId, status },
  });

  if (find.length > 0) throw new Error('Already followed');

  return db.Follow.create({ senderId, receiverId, status });
};

export const getPendingRequest = async (
  receiverId: string,
  status: string = 'Pending'
) => {
  const requests = await db.Follow.findAll({ where: { receiverId, status } });
  console.log('requests:', requests);

  if (requests.length > 0) return requests;
  else throw new Error('No Pending Request');
};

export const updateRequestStatus = async (
  receiverId: string,
  senderId: string,
  status: string
) => {
  if (status === 'Accepted') {
    return db.Follow.update(
      { status },
      { where: { receiverId, senderId, status: 'Pending' } }
    );
  }
  if (status === 'Blocked' || status === 'Rejected') {
    return db.Follow.update({ status }, { where: { receiverId, senderId } });
  }
};

export const getFollower = async (receiverId: string) => {
  return db.follow.findAll({
    attributes: ['senderId', 'status'],
    where: { receiverId, status: 'Accepted' },
    include: {
      model: db.User,
      as: 'sender',
      attributes: {
        exclude: ['email', 'password', 'dob', 'bio', 'createdAt', 'updatedAt'],
      },
    },
  });
};

export const getFollowing = async (senderId: string) => {
  return db.Follow.findAll({
    attributes: ['receiverId', 'status'],
    where: { senderId, status: 'Accepted' },
  });
};
