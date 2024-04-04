import db from '../models';
import Handler from '../utils/Handler';

const users = [
  {
    username: 'dhaval_jethava',
    name: 'dhaval',
    email: 'dhaval.work1123@gmail.com',
    password:
      '$2a$10$RUSY11rPjg2BLpMZ97jKT.MAlRO.fceiwAYGSOKaemimkd5BiiYQe' /* Dhaval@123 */,
    dob: '2000-03-01',
    bio: 'Hello',
    createdAt: '2024-03-10 16:49:23.171+05:30',
    updatedAt: '2024-03-10 16:49:23.171+05:30',
  },
  {
    username: 'dharmik_jethava',
    name: 'dharmik',
    email: 'dharmikwork1123@gmail.com',
    password:
      '$2a$10$RUSY11rPjg2BLpMZ97jKT.MAlRO.fceiwAYGSOKaemimkd5BiiYQe' /* Dhaval@123 */,
    dob: '2000-03-01',
    bio: 'Hello',
    createdAt: '2024-03-10 16:49:23.171+05:30',
    updatedAt: '2024-03-10 16:49:23.171+05:30',
  },
  {
    username: 'rushil_jethava',
    name: 'rushil',
    email: 'rushil.work1123@gmail.com',
    password:
      '$2a$10$RUSY11rPjg2BLpMZ97jKT.MAlRO.fceiwAYGSOKaemimkd5BiiYQe' /* Dhaval@123 */,
    dob: '2000-03-01',
    bio: 'Hello',
    createdAt: '2024-03-10 16:49:23.171+05:30',
    updatedAt: '2024-03-10 16:49:23.171+05:30',
  },
];

export const constant = async () => {
  try {
    await db.sequelize.authenticate();
    await db.User.bulkCreate(users)
      .then((result: any) => {
        console.log('awaitdb.User.bulkCreate  result:', result);
      })
      .catch((err: any) => {
        console.log('awaitdb.User.bulkCreate  err:', err);
      });
    console.log('Users created successfully');
  } catch (error) {
    console.log('Users created unsuccessfully...', error);
  }
};
