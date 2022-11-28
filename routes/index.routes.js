const router = require("express").Router();
const JamSession = require('../models/JamSession.model');
const Host = require('../models/Host.model');
const User = require('../models/User.model');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/events", async (req, res, next) => {
  const events = await JamSession.find().populate('host');
  res.json(events);
})

router.get("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const jamEvent = await JamSession.findById(id).populate('host').populate('players')
    res.json(jamEvent);

  } catch (error) {
    console.log(error);
  }
})

router.put('/events/:id', async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const body = req.body;
    await JamSession.findByIdAndUpdate(id, { $push: { players: body.id } })
    res.status(200).json({ message: "Player added successfully" })
  } catch (error) {
    console.log(error);
  }
})

router.delete('/events/:id', async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const body = req.body;
    await JamSession.findByIdAndUpdate(id, { $pull: { players: body.id } })
    res.status(200).json({ message: "Player removed successfully" })
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
