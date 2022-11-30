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

    const jamSess = await JamSession.findById(id)
    
    ////need to check if capacity is reached
    if (jamSess.players.length < jamSess.capacity) {
      const jamSessPlayers = Array.from(new Set([...jamSess.players.map((player)=>player._id.toString()), body.id]))
      await JamSession.findByIdAndUpdate(id, { players: jamSessPlayers } )

      const user = await User.findById(body.id)
      const userJamSess = Array.from(new Set([...user.jamSessions.map((jamSess)=>jamSess._id.toString()), id]))

      await User.findByIdAndUpdate(body.id, { jamSessions: userJamSess } )
      res.status(500).json({ message: "Player added successfully" })
    } else {
      res.status(200).json({ message: "This jam session is full" })
    }

    
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

router.get("/locations", async (req, res, next) => {
  try {
    const allLocations = await Host.find();
    res.status(200).json(allLocations);
  } catch (error) {
    console.log(error)
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
