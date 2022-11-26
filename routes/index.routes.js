const router = require("express").Router();
const JamSession = require('../models/JamSession.model');
const Host = require('../models/Host.model');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/events", async (req, res, next) => {
  const events = await JamSession.find();
  const eventHost = await Host.findOne(JamSession.host);
  console.log('eventHost:', eventHost);
  // console.log('events:', events);
  res.json(events);
})

module.exports = router;
