'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    title: DataTypes.STRING,
    alias: DataTypes.STRING,
    description: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {});
  Categories.associate = function(models) {
    // associations can be defined here
  };
  return Categories;
};