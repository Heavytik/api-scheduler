/*
  JOB HERE:
  - configure port
  - configure database access from .env
  - configure test database
*/

require("dotenv").config();

const { PORT } = process.env;
let { MONGODB_URI } = process.env;
const { SECRET } = process.env;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
};
