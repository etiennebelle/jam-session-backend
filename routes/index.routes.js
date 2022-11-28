const router = require("express").Router();
const JamSession = require('../models/JamSession.model');
const Host = require('../models/Host.model');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/events", async (req, res, next) => {
  const events = await JamSession.find().populate('host');
  res.json(events);
})

router.get("/events/:id", async (req, res, next) => {
  const { id } = req.params;
  const jamEvent = await JamSession.findById(id).populate('host')
  console.log(jamEvent);
  res.json(jamEvent);
})


module.exports = router;
