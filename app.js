const express = require('express')

require('dotenv').config()

const app = express()

app.use(express.json());


const userRouter = require('./Routes/userRouter')

const productRouter = require('./Routes/productRouter')

const sequelize = require('./config/db')

sequelize.sync({ force: false }).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Error syncing the database:', err);

});


app.use('/user', userRouter)

app.use('/product', productRouter)


    

const port = process.env.PORT

app.listen(port, () => {
    console.log(`server running on ${port}`);
})