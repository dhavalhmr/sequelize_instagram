import db from '../models';
import { constant } from './default';
const force = false;
const sequelize = db.sequelize;
const initializedDatabase = async () => {
  try {
    await sequelize
      .authenticate()
      .then(async (): Promise<any> => {
        console.log('Connection has been established successfully');
        await sync();
      })
      .catch((err: any): void => {
        console.log('Database has thrown error', err);
      });
  } catch (error) {
    console.log('Error while initializing Database');
  }

  function sync() {
    sequelize
      .sync({ alter: true, force })
      .then(async (): Promise<any> => {
        console.log('Database has been syncronise successfully');
        if (force) await constant();
      })
      .catch((err: any): void =>
        console.log('Database has thrown error in syncronise', err)
      );
  }
};

export default initializedDatabase;
