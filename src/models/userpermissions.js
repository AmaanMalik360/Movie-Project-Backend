'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPermissions.belongsTo(models.Users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      UserPermissions.belongsTo(models.Permissions, {
        foreignKey: "permissionId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  UserPermissions.init({
    userId: {
      type: DataTypes.INTEGER,
      // primaryKey: true,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      // primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserPermissions',
  });
  return UserPermissions;
};