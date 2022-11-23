const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const router = express.Router();

// POST User Authentication /signup
// Creates a new user in the DB.
router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body;

    try {

        if (username === '' || email === '' || password === '') {
            res.status(400).json({ message: 'Please, provide username, e-mail & password' })
            return;
        }

        // Use regex to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Provide a valid email address.' });
            return;
        }

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            res.status(400).json({ message: 'Username already taken' });
            return;
        }
        
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = bcrypt.genSaltSync(11);
        const hashedPassword = bcrypt.hashSync(password, salt)

        // Create a new user
        const newUser = await User.create({ username, email, password: hashedPassword })
        res.status(201).json({ message: 'User successfully created!' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
 
 
// POST  /user-auth/login
// ...
 
 
// GET  /user-auth/verify
// ...

module.exports = router;