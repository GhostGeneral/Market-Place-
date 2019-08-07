'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  Group.associate = function(models) {
    // associations can be defined here
  };


    //exclude certain fields
    Group.prototype.toJSON =  function () {
      var values = Object.assign({}, this.get());
    
      delete values.createdAt;
      delete values.updatedAt;
  
      return values;
    }
  return Group;
};