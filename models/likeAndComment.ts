'use strict';
import { Model } from 'sequelize';
export default (sequelize: any, DataTypes: any) => {
  type LikeAndCommentAttributes = {
    id: number;
    userId: string;
    postId: string;
    comment: string;
  };
  class LikeAndComment
    extends Model<LikeAndCommentAttributes>
    implements LikeAndCommentAttributes
  {
    id!: number;
    userId!: string;
    postId!: string;
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
  LikeAndComment.init(
    {
      id: DataTypes.BIGINT,
      userId: DataTypes.STRING,
      postId: DataTypes.STRING,
      comment: DataTypes.STRING,
    },
    { timestamps: true, sequelize, modelName: 'LikeAndComment' }
  );
  return LikeAndComment;
};
