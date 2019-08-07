'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    title: {
      type: DataTypes.STRING
    },
    description:{
      type: DataTypes.TEXT
    },
    categoryId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.STRING
    },
    discount: {
      type: DataTypes.STRING
    },
    sku: {
      type: DataTypes.STRING
    },
    productPhoto: {
      type: DataTypes.STRING,
      get(){
        var productPhoto = (this.getDataValue('productPhoto')) ? this.getDataValue('productPhoto') : 'https://easytruck247.com/main/img/no_profile.png';
        return productPhoto;
      }
    }
  }, {});
  Products.associate = function(models) {
    // associations can be defined here
  };
  return Products;
};