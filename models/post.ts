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
      like: {
        type: DataTypes.JSON(DataTypes.ARRAY(DataTypes.BIGINT)),
        defaultValue: { userId: [] },
      }, // userIds of users who are like post will be store particular post
      comment: { type: DataTypes.ARRAY(DataTypes.JSON), defaultValue: [] },
    },
    {
      hooks: {
        afterCreate: async (post: Post) => {
          try {
            // Find the corresponding user
            const user = await sequelize.models.User.findByPk(post.userId);

            if (user) {
              // Update the totalPost array
              user.totalPost = user.totalPost || [];
              user.totalPost.push(post.id);
              await user.save();
            }
          } catch (error) {
            console.error('Error updating totalPost:', error);
          }
        },
      },
      timestamps: true,
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};

/*
I have User table who have totalPost and also i have Post table who have id(primary key of post table)
now i have already given relation to post.userId(which is primary key of user table)
and now i want to give relation like post.userId===User.id then it should be get pushed with its Post.id in User.totalPost
*/
