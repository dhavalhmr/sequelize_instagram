'use strict';
import { Model } from 'sequelize';
export default (sequelize: any, DataTypes: any) => {
  type LikeAndCommentAttributes = {
    id: number;
    comment: string;
    type: string;
  };
  class LikeAndComment
    extends Model<LikeAndCommentAttributes>
    implements LikeAndCommentAttributes {
    id!: number;
    comment!: string;
    type!: string;
    static associate(models: any) {
      LikeAndComment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      LikeAndComment.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }
  LikeAndComment.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      comment: DataTypes.STRING,
      type: { type: DataTypes.ENUM('Like', 'Comment') },
    },
    { timestamps: true, sequelize, modelName: 'LikeAndComment' }
  );
  return LikeAndComment;
};
