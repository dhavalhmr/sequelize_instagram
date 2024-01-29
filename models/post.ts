'use strict';
import { Model } from 'sequelize';
export default (sequelize: any, DataTypes: any) => {
  type PostAttribute = {
    id: number;
    userId: number;
    description: string;
    photoUpload: string;
    like: { userId: number[] };
    comment: string;
  };
  class Post extends Model<PostAttribute> implements PostAttribute {
    id!: number;
    userId!: number;
    description!: string;
    photoUpload!: string;
    like!: { userId: number[] };
    comment!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Post.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.BIGINT, allowNull: false },
      description: DataTypes.STRING,
      photoUpload: { type: DataTypes.STRING, allowNull: false },
      like: { type: DataTypes.ARRAY(DataTypes.BIGINT), defaultValue: [] }, // userIds of users who are like post will be store particular post
      comment: { type: DataTypes.ARRAY(DataTypes.JSON), defaultValue: [] },
    },
    {
      timestamps: true,
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
