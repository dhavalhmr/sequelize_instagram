'use strict';
import { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

type UserAttributes = {
  id: number;
  name:string;
  username: string;
  email: string;
  password: string;
  dob: Date;
  bio: string;
};

export default (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    id!: number;
    name!: string;
    username!: string;
    email!: string;
    password!: string;
    dob!: Date;
    bio!: string;
    static associate(models: any) {
      User.hasMany(models.Post, { as: 'posts', foreignKey: 'userId' });
      User.hasMany(models.Follow, {
        as: 'follower',
        foreignKey: 'receiverId',
      });
      User.hasMany(models.Follow, {
        as: 'following',
        foreignKey: 'senderId',
      });
    }
    validPassword(password: string): boolean {
      return bcryptjs.compareSync(password, this.password);
    }
  }

  User.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value: string) {
          this.setDataValue('username', value?.trim());
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value: string) {
          this.setDataValue('name', value?.trim());
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(value: string) {
          this.setDataValue('email', value?.trim());
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          isStrongPassword(value: string): void {
            // Use a regular expression to check for strong password requirements
            if (
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
                value
              )
            )
              throw new Error(
                'Password must be strong with at least one lowercase letter, one uppercase letter, one digit, and one special character.'
              );
          },
        },
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          is18(value: number) {
            if (value < 18) throw new Error('Minimum age is required 18');
          },
        },
      },
      bio: DataTypes.STRING(500),
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          try {
            if (user.changed('password')) {
              const salt = await bcryptjs.genSaltSync(10);
              user.password = bcryptjs.hashSync(user.password, salt);
            }
          } catch (error) {
            console.error('Error during password hashing:', error);
          }
        },
        beforeUpdate: async (user) => {
          try {
            if (user.changed('password')) {
              const salt = await bcryptjs.genSaltSync(10);
              user.password = bcryptjs.hashSync(user.password, salt);
            }
          } catch (error) {
            console.error('Error during password hashing:', error);
          }
        },
      },
      timestamps: true,
      sequelize,
      modelName: 'User',
    }
  );

  User.prototype.validPassword = function (password: string): boolean {
    return bcryptjs.compareSync(password, this.password);
  };

  return User;
};
