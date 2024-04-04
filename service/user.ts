import db from '../models';

export const createUser = async (body: JSON): Promise<any> => {
  const user = await db.User.create(body);
  if (!user) throw new Error('User not created');
  return user;
};

export const findUserById = async (id: number | string): Promise<any> => {
  const user = await db.User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const findUser = async (whereQuery: any): Promise<any> => {
  const user = await db.User.findOne({ where: whereQuery });
  if (!user) throw new Error('User not found');
  return user;
};
