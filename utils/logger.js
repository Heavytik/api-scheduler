/* eslint-disable no-console */
/*
  Lets specialize console.log and console.error
*/

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
