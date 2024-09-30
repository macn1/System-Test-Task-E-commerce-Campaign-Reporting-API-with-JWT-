const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  
        primaryKey: true      
      },
  campaignName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adGroupId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fsnId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adSpend: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  directRevenue: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  indirectRevenue: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  directUnits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  indirectUnits: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Product;