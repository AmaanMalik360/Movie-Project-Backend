'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavouriteMovies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FavouriteMovies.belongsTo(models.Users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      FavouriteMovies.belongsTo(models.Movies, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  FavouriteMovies.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'FavouriteMovies',
  });
  return FavouriteMovies;
};