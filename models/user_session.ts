'use strict';
import { Model } from 'sequelize';

export default (sequelize: any, DataTypes: any) => {
  class Session extends Model {
    static associate(models: any) {
      // Define associations if needed
    }
  }

  Session.init(
    {
      sid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      sess: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE(6),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'session',
      timestamps: false,
    }
  );

  return Session;
};
