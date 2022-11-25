const router = require("express").Router();
const JamSession = require("../models/JamSession.model");
const Host = require("../models/Host.model");

router.post("/create-jam-session", async (req, res) => {
    const {jamSessionName, date, capacity, genre, description, host} = req.body;

    try {
        const createdJamSession = await JamSession.create({jamSessionName, date, capacity, genre, description, host})
        await Host.findOneAndUpdate(host, {$push: {jamSessions: createdJamSession._id}})
        res.status(201).json({message: "Jam Session created successfully"});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = router;
