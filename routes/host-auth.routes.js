const router = require("express").Router();
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Host = require("../models/Host.model");
const {isHostAuthenticated} = require("../middleware/jwt.host-middleware");
const bcrypt = require('bcryptjs');

router.post("/signup", async (req, res) => {
    try {
        const {barName, address, email, password} = req.body;
        
        // check that all inputs are filled in
        if (!barName || !address || !email || !password) {
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


module.exports = router;
