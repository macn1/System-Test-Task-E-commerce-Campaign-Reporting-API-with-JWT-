const User = require('../models/userModel')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const createUser = async (req, res) => {

        try {

                const { username, email, password } = req.body

                const user = await User.create({ username, email, password })
                res.status(201).json({ message: "user created ", user: user })
        } catch (error) {

                res.status(500).json({ message: "Error creating user", error: error.message })
        }
}

const getUserById = async (req, res) => {
        try {
                const user = await User.findByPk(req.params.id);
                if (user) {
                        res.json(user);
                } else {
                        res.status(404).json({ error: 'User not found' });
                }
        } catch (error) {
                res.status(500).json({ error: 'Error fetching user', error: error.message });
        }
};
const updateUser = async (req, res) => {
        try {
                const { username, email, password } = req.body;
                const user = await User.findByPk(req.params.id);
                if (user) {
                        user.username = username || user.username;
                        user.email = email || user.email;


                        if (password) {
                                user.password = await bcrypt.hash(password, 10);
                        }

                        await user.save();
                        res.json({ message: 'User updated successfully', user });
                } else {
                        res.status(404).json({ error: 'User not found' });
                }
        } catch (error) {
                res.status(500).json({ error: 'Error updating user', details: error.message });
        }
};


const deleteUser = async (req, res) => {
        try {
                const user = await User.findByPk(req.params.id);
                if (user) {
                        await user.destroy();
                        res.json({ message: 'User deleted successfully' });
                } else {
                        res.status(404).json({ error: 'User not found' });
                }
        } catch (error) {
                res.status(500).json({ error: 'Error deleting user', details: error.message });
        }
};
const login = async (req, res) => {
        const { email, password } = req.body;
        try {
          const user = await User.findOne({ where: { email } });
      
          
          if (user && await bcrypt.compare(password, user.password)) {
           
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error during login', details: error.message });
        }
      };
      

module.exports = { createUser, getUserById, updateUser,deleteUser ,login}