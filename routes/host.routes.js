const router = require("express").Router();
const JamSession = require("../models/JamSession.model");

router.post("/create-jam-session", async (req, res) => {
    const {jamSessionName, date, capacity, genre, description} = req.body;

    try {
        await JamSession.create({jamSessionName, date, capacity, genre, description})
        res.status(201).json({message: "Jam Session created successfully"});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = router;
