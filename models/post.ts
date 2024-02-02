'use strict';
import { Model } from 'sequelize';
export default (sequelize: any, DataTypes: any) => {
  type PostAttribute = {
    id: number;
    description: string;
    photoUpload: string;
    like: { userId: number[] };
    comment: string;
  };
  class Post extends Model<PostAttribute> implements PostAttribute {
    id!: number;
    description!: string;
    photoUpload!: string;
    like!: { userId: number[] };
    comment!: string;
    static associate(models: any) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Post.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      description: DataTypes.STRING,
      photoUpload: { type: DataTypes.STRING, allowNull: false },
      like: {
        type: DataTypes.JSON(DataTypes.ARRAY(DataTypes.BIGINT)),
        defaultValue: { userId: [] },
      }, // userIds of users who are like post will be store particular post
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
