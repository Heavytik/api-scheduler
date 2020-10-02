const mongoose = require("mongoose");
const supertest = require("supertest");
const moment = require("moment");
const app = require("../app");

const api = supertest(app);
const Event = require("../models/event");

const initialData = [
  {
    text: "aamupala",
    start: moment({ hour: 8, minute: 0 }),
    image: "breakfast",
  },
  {
    text: "oppitunti 1",
    start: moment({ hour: 8, minute: 30 }),
    image: "study",
  },
  {
    text: "oppitunti 2",
    start: moment({ hour: 10, minute: 30 }),
    image: "study",
  },
  {
    text: "ruoka",
    start: moment({ hour: 17, minute: 0 }),
    image: "food",
  },
  {
    text: "vapaa-aika",
    start: moment({ hour: 17, minute: 30 }),
    image: "freetime",
  },
  {
    text: "iltapala",
    start: moment({ hour: 20, minute: 0 }),
    image: "breakfast",
  },
  {
    text: "nukkumisaika",
    start: moment({ hour: 6, minute: 30 }),
    image: "sleep",
  },
];

beforeEach(async () => {
  await Event.deleteMany({});
  await Event.insertMany(initialData);
});

test("Events are returned as json", async () => {
  await api
    .get("/api/events")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Check order, first and last", async () => {
  const response = await api.get("/api/events");
  const startTimes = response.body.map((event) => moment(event.start));
  expect(
    startTimes.slice(1).find((time) => time.isBefore(startTimes[0]))
  ).toBeUndefined();

  expect(
    startTimes
      .slice(0, -1)
      .find((time) => time.isAfter(startTimes[startTimes.length - 1]))
  ).toBeUndefined();
});

afterAll(() => {
  mongoose.connection.close();
});
