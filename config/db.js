const {Sequelize} = require('sequelize')

const sequelize = new Sequelize({
    
    dialect:'sqlite',
      storage: process.env.DB_STORAGE || './config/db.sqlite'
})


module.exports =sequelize