/*
  JOB HERE:
  - set up router "app"
  - add get route
*/

const eventsRouter = require("express").Router();
const Event = require("../models/event");

eventsRouter.get("/", async (request, response) => {
  const events = await Event.find({}).sort({ start: 1 });

  if (events) {
    response.json(events.map((event) => event.toJSON()));
  } else {
    response.status(404).end();
  }
});

module.exports = eventsRouter;
