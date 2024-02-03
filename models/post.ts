'use strict';
import { Model } from 'sequelize';
export default (sequelize: any, DataTypes: any) => {
  type PostAttribute = {
    id: number;
    description: string;
    photoUpload: string;
  };
  class Post extends Model<PostAttribute> implements PostAttribute {
    id!: number;
    description!: string;
    photoUpload!: string;
    static associate(models: any) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.hasMany(models.LikeAndComment, { foreignKey: 'userId', as: 'like' });
      Post.hasMany(models.LikeAndComment, { foreignKey: 'userId', as: 'comment' });
    }
  }
  Post.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      description: DataTypes.STRING,
      photoUpload: { type: DataTypes.STRING, allowNull: false },
    },
    {
      timestamps: true,
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
