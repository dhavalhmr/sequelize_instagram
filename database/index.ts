import db from '../models';

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

  const sync = () => {
    sequelize
      .sync({ alter: true, force: false })
      .then((): void =>
        console.log('Database has been syncronise successfully')
      )
      .catch((err: any): void =>
        console.log('Database has thrown error in syncronise', err)
      );
  };
};

export default initializedDatabase;
