const router = require("express").Router();
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Host = require("../models/Host.model");


router.post("/signup", async (req, res) => {
    try {
        const {barName, address, email, password} = req.body;
        
        // check that all inputs are filled in
        if (!email || !password || !email || !password) {
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
    
        await Host.create({barName, address, email, password: hashedPassword})
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

module.exports = router;
