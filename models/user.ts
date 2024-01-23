'use strict';
import { Model } from 'sequelize';

type UserAttributes = {
  id: number;
  username: string;
  email: string;
  password: string;
  dob: Date;
  totalPost: string;
  bio: string;
};

export default (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    id!: number;
    username!: string;
    email!: string;
    password!: string;
    dob!: Date;
    totalPost!: string;
    bio!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }

  // User.associate = function (models) {
  // };
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
          isStrongPassword(value: string) {
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
      totalPost: DataTypes.ARRAY(DataTypes.STRING),
      bio: DataTypes.STRING(500),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
