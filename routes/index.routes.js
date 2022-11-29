const router = require("express").Router();
const JamSession = require('../models/JamSession.model');
const Host = require('../models/Host.model');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt user-middleware');

router.get("/events", async (req, res, next) => {
  try {  
    const events = await JamSession.find().populate('host');
    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
})


router.get("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const jamEvent = await JamSession.findById(id).populate('host').populate('players')
    res.status(200).json(jamEvent);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.put('/events/:id', isAuthenticated, async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const body = req.body;
    
    await JamSession.findByIdAndUpdate(id, { $push: { players: body.id } })
    await User.findByIdAndUpdate(body.id, { $push: { jamSessions: id } })
    res.status(200).json({ message: "Player added successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.delete('/events/:id', isAuthenticated, async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const body = req.body;
    await JamSession.findByIdAndUpdate(id, { $pull: { players: body.id } })
    await User.findByIdAndUpdate(body.id, { $pull: { jamSessions: id } })
    res.status(200).json({ message: "Player removed successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })

  }
})

router.get("/locations/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentHost = await Host.findById(id).populate('jamSessions');
    res.status(200).json(currentHost);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }

})

module.exports = router;
