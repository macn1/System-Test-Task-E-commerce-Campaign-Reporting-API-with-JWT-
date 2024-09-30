
const express =require('express')

const router = express.Router()

const {authenticateToken} = require('../middleware/authMiddleware')


const {createUser,getUserById,updateUser,deleteUser,login} = require('../Controllers/userContoller')


router.post('/',createUser)

router.get('/:id',authenticateToken,getUserById)

router.put('/:id',authenticateToken,updateUser)

router.delete('/:id',authenticateToken,deleteUser)

router.post('/login',login)


module.exports =router