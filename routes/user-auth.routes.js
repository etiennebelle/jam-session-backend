const express = require('express');
const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt user-middleware');
const { restart } = require('nodemon');

const router = express.Router();

// POST User Authentication /signup
// Creates a new user in the DB.
router.post('/signup', async (req, res, next) => {
    const { username, email, password, instrument } = req.body;

    try {

        if (username === '' || email === '' || password === '') {
            res.status(400).json({ message: 'Please, provide username, e-mail & password' })
            return;
        }

        if (instrument === '') {
            res.status(400).json({message: 'Please, select at least one instrument, you\'ll be able to change it or add other ones on your profile page' })
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

        const salt = genSaltSync(11);
        const hashedPassword = hashSync(password, salt)

        // Create a new user
        const newUser = await User.create({ username, email, password: hashedPassword, instrument})
        res.status(201).json({ message: 'User successfully created!' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
 
 
// POST  /user-auth/login
// Verifies email and password and returns a JWT.

router.post('/login', async (req, res, next) => {

    try {

        const { email, password } = req.body;

        if (email === '' || password === '') {
            res.status(400).json({ message: 'Provide email and password' });
            return;
        }

        const currentUser = await User.findOne({ email })

        if (currentUser) {
            if (compareSync(password, currentUser.password)) {
                
                const { _id, email, username, instrument } = currentUser;
                const payload = { _id, email, username, instrument };
                
                const authToken = jwt.sign(
                    {data: payload},
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: '6h' }
                );

                res.status(200).json({ authToken });

            } else {
                res.status(400).json({ message: 'Unable to authenticate the user' });
            }
        } else {
            res.status(401).json({ message: 'User not found' });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }

})
 
 
// GET  /user-auth/verify
router.get('/verify', isAuthenticated, (req, res, next) => {
    res.status(200).json(req.payload);
})


// GET User data one the profile page
router.get('/:id', isAuthenticated, async(req, res, next) => {
    try {
        const { id } = req.params;
        
        const currentUser = await User.findById(id).populate('jamSessions');
        res.status(200).json(currentUser);

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;