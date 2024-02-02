'use strict';
import { Model, DataTypes } from 'sequelize';

type FollowAttributes = {
  id: number;
  status: string;
};
export default (sequelize: any) => {
  class Follow extends Model<FollowAttributes> implements FollowAttributes {
    id!: number;
    status!: string;
    static associate(models: any) {
      Follow.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
      Follow.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver',
      });
    }
  }
  Follow.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      status: DataTypes.ENUM('Accepted', 'Rejected', 'Blocked', 'Pending'),
    },
    {
      timestamps: true,
      sequelize,
      modelName: 'Follow',
    }
  );
  return Follow;
};
