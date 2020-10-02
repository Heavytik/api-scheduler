const eventsRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

eventsRouter.get("/", async (request, response) => {
  const users = await User.find({}).sort();

  if (users) {
    response.json(users.map((event) => event.toJSON()));
  } else {
    response.status(404).end();
  }
});

eventsRouter.post("/", async (request, response) => {
  response.send(302).end();
  const { body } = request;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = eventsRouter;
