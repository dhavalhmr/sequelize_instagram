import db from '../models';

const sequelize = db.sequelize;
const initializedDatabase = async () => {
  try {
    sequelize
      .sync({ alter: true, force: false })
      .then((): void => {
        console.log('Connected to Database');
      })
      .catch((err: any): void => {
        console.log('Database has thrown error', err);
      });
  } catch (error) {
    console.log('Error while initializing Database');
  }
};

export default initializedDatabase;
