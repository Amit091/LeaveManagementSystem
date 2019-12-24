'use strict';
module.exports = (sequelize, DataTypes) => {
  const leaves = sequelize.define('leaves', {
    name: DataTypes.STRING,
    number: DataTypes.NUMBER,
    description: DataTypes.STRING
  }, {});
  leaves.associate = function(models) {
    // associations can be defined here
  };
  return leaves;
};