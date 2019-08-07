'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName:{
      type: DataTypes.STRING
    },
    email:  {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
    isActive:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    groupId:  {
      type: DataTypes.INTEGER,
      defaultValue: 4
    },
    businessName: {
      type: DataTypes.STRING
    },
    address:{
      type: DataTypes.STRING
    },
    city:{
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    country:{
      type: DataTypes.STRING,
      defaultValue: 'Nigeria'
    },
    profilePhoto: {
      type: DataTypes.STRING,
      get(){
        var profilePhoto = (this.getDataValue('profilePhoto')) ? this.getDataValue('profilePhoto') : 'https://easytruck247.com/main/img/no_profile.png';
        return profilePhoto;
      }
    },
    mobilePhoneNo:{
      type: DataTypes.STRING
    },
    lastLoggedIn: DataTypes.DATE,
    isApproved:  {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};