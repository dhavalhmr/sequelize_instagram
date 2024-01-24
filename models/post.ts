'use strict';
import { Model } from 'sequelize';
export default (sequelize: any, DataTypes: any) => {
  type PostAttribute = {
    id: number;
    description: string;
    photoUpload: string;
    like: string;
    comment: string;
  };
  class Post extends Model<PostAttribute> implements PostAttribute {
    id!: number;
    description!: string;
    photoUpload!: string;
    like!: string;
    comment!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Post.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      description: DataTypes.STRING,
      photoUpload: DataTypes.STRING,
      like: DataTypes.STRING,
      comment: DataTypes.STRING,
    },
    {
      timestamps: true,
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
