import db from '../models';
import Handler from '../utils/Handler';

const users = [
  {
    id: 1,
    username: 'dhaval_jethava',
    name: 'dhaval',
    email: 'dhaval.work1123@gmail.com',
    password: 'Dhaval@123',
    dob: '',
    bio: 'Hello',
    createdAt: '2024-03-10 16:49:23.171+05:30',
    updatedAt: '2024-03-10 16:49:23.171+05:30',
  },
  {
    id: 2,
    username: 'dharmik_jethava',
    name: 'dharmik',
    email: 'dharmikwork1123@gmail.com',
    password: 'Dhaval@123',
    dob: '',
    bio: 'Hello',
    createdAt: '2024-03-10 16:49:23.171+05:30',
    updatedAt: '2024-03-10 16:49:23.171+05:30',
  },
  {
    id: 3,
    username: 'rushil_jethava',
    name: 'rushil',
    email: 'rushil.work1123@gmail.com',
    password: 'Dhaval@123',
    dob: '',
    bio: 'Hello',
    createdAt: '2024-03-10 16:49:23.171+05:30',
    updatedAt: '2024-03-10 16:49:23.171+05:30',
  },
];

export function constant() {
  Handler(async () => {
    await db.User.bulkCreate(users);
  });
}
