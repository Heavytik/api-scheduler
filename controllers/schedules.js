/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const schedulesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Schelude = require("../models/schelude");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

schedulesRouter.get("/", async (request, response) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const schedules = await Schelude.find({ users: `${user.id}` });

  if (schedules) {
    response.json(schedules.map((schedule) => schedule.toJSON()));
  } else {
    response.json([].toJSON());
  }
});

schedulesRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const scheduleFromFront = body;

  console.log("scheduleFromFront", scheduleFromFront);

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);
  const scheduleInDatabase = await Schelude.findById(request.params.id);

  // check ownership and update
  if (
    scheduleInDatabase.users.find(
      (userid) => userid.toString() === user._id.toString()
    )
  ) {
    const savedSchelude = await Schelude.findByIdAndUpdate(
      request.params.id,
      scheduleFromFront,
      { new: true }
    );

    response.json(savedSchelude);
  } else {
    response.status(403).end();
  }
});

schedulesRouter.post("/", async (request, response) => {
  const { body } = request;
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const schelude = new Schelude({
    name: body.name,
    weekDays: body.weekDays,
    users: [user._id],
    events: body.events,
  });

  const savedSchelude = await schelude.save();

  user.scheludes = user.scheludes.concat(savedSchelude._id);
  await user.save();

  response.json(savedSchelude);
});

schedulesRouter.delete("/:id", async (request, response) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);
  const scheduleInDatabase = await Schelude.findById(request.params.id);

  if (
    scheduleInDatabase.users.find(
      (userid) => userid.toString() === user._id.toString()
    )
  ) {
    const deleteResult = await Schelude.findByIdAndRemove(request.params.id);

    response.json(deleteResult);
  } else {
    response.status(403).end();
  }
});

module.exports = schedulesRouter;
