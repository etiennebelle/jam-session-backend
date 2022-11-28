const router = require("express").Router();
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Host = require("../models/Host.model");
const {isHostAuthenticated} = require("../middleware/jwt.host-middleware");
const bcrypt = require('bcryptjs');
const JamSession = require("../models/JamSession.model");
const uploader = require('../middleware/cloudinary.config.js');
const mongoose = require('mongoose');

/// POST Signup 
router.post("/signup", async (req, res) => {
    try {
        const {barName, address, town, email, password} = req.body;
        
        // check that all inputs are filled in
        if (!barName || !address || !town || !email || !password) {
            res.status(400).json({ message: "Please fill in all the fields" });
            return;
        }

        // check valid email
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))  {
            console.log("error password")
            res.status(400).json({ message: 'Please provide a valid email address.' });
            return;
        }

        const salt = genSaltSync(11);
        const hashedPassword = hashSync(password, salt);
    
        await Host.create({barName, address, town, email, password: hashedPassword})
        res.status(201).json({message: "Host created successfully"});
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.status(400).json({ message: "Host already exists - please check your email, address, or name" })
        } else {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    
});

/// POST Login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

     // check that all inputs are filled in
    if (!email || !password) {
        res.status(400).json({ message: "Please fill in all the fields" });
        return;
    }

    const currentUser = await Host.findOne({email})
    try {
        if (!currentUser) {
            res.status(401).json({ message: "User not found" })
            return;
        } else {
            const correctPassword = bcrypt.compareSync(password, currentUser.password);
            if (correctPassword) {
                const {_id, email, name} = currentUser;
                
                const payload = {_id, email, name};
                const authToken = jwt.sign(
                    {data: payload}, 
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                )
                res.status(200).json({ authToken });
            } else {
                res.status(401).json({ message: "Wrong username or password" });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
});

router.get('/verify', isHostAuthenticated, (req, res) => {
    res.status(200).json(req.payload);
})

/// POST Create jam session
router.post("/create-jam-session", uploader.single("imageUrl"), async (req, res) => {
    console.log('file is: ', req.file)
    console.log('body is: ', req.body)

    const {jamSessionName, date, time, capacity, genre, description, host} = req.body;

    try {
        const createdJamSession = await JamSession.create({jamSessionName, date, time, capacity, genre, description, host, image: req.file.path})
        const hostId = mongoose.Types.ObjectId(host);
        await Host.findByIdAndUpdate( hostId, {$push: {jamSessions: createdJamSession._id}})
        res.status(201).json({message: "Jam Session created successfully"});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
});

/// PUT- Edit jam session
router.put('/jam-sessions/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body

    await JamSession.findByIdAndUpdate(id, body, {new:true})
    res.status(200).json({ message: "Jam Session Edited successfully" })
})

/// DELETE - Delete jam session
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await JamSession.findByIdAndDelete(id)
    res.status(200).json({ message: "Jam Session Deleted successfully" })
})


/// GET Current host info 
router.get('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        
        const currentHost = await Host.findById(id).populate('jamSessions');
        console.log(currentHost);
        res.status(200).json(currentHost);

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
