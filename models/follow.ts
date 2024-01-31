'use strict';
import { Model, DataTypes } from 'sequelize';

type FollowAttributes = {
  id: number;
  receiverId: number;
  senderId: number;
  status: string;
};
export default (sequelize: any) => {
  class Follow extends Model<FollowAttributes> implements FollowAttributes {
    id!: number;
    receiverId!: number;
    senderId!: number;
    status!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      //   Follow.belongsTo(models.User, { foreignKey: 'userId' as 'receiverId' });
    }
  }
  Follow.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      receiverId: DataTypes.BIGINT,
      senderId: DataTypes.BIGINT,
      status: DataTypes.ENUM('Accepted', 'Rejected',"Blocked", 'Pending'),
    },
    {
      timestamps: true,
      sequelize,
      modelName: 'Follow',
    }
  );
  return Follow;
};
