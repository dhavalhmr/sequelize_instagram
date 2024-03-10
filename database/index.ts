import db from '../models';
import { constant } from './default';

const sequelize = db.sequelize;
const initializedDatabase = async () => {
  try {
    sequelize
      .authenticate()
      .then((): void => {
        console.log('Connection has been established successfully');
        sync();
      })
      .catch((err: any): void => {
        console.log('Database has thrown error', err);
      });
  } catch (error) {
    console.log('Error while initializing Database');
  }

  let force = true;

  function sync() {
    sequelize
      .sync({ alter: true, force })
      .then((): void =>
        console.log('Database has been syncronise successfully')
      )
      .catch((err: any): void =>
        console.log('Database has thrown error in syncronise', err)
      );
  }

  if (force) {
    console.log(
      '=>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
    );

    constant();
  }
};

export default initializedDatabase;
