const router = require("express").Router();
const JamSession = require('../models/JamSession.model');
const Host = require('../models/Host.model');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/events", async (req, res, next) => {
  const events = await JamSession.find().populate('host');
  console.log('events:', events);
  res.json(events);
})

module.exports = router;
