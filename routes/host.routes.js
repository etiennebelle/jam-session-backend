const router = require("express").Router();
const JamSession = require("../models/JamSession.model");
const Host = require("../models/Host.model");
const uploader = require('../middleware/cloudinary.config.js');

router.post("/create-jam-session", uploader.single("imageUrl"), async (req, res) => {
    console.log('file is: ', req.file)
    console.log('body is: ', req.body)

    const {jamSessionName, date, time, capacity, genre, description, hostid} = req.body;

    try {
        const createdJamSession = await JamSession.create({jamSessionName, date, time, capacity, genre, description, host: hostid, image: req.file.path})
        await Host.findOneAndUpdate({_id: hostid}, {$push: {jamSessions: createdJamSession._id}})
        res.status(201).json({message: "Jam Session created successfully"});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
});



module.exports = router;
