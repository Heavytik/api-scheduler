/*
  JOB HERE:
  - create Node server with app (express entity)
  - start server listen funtion
*/

const http = require("http");
const config = require("./utils/config");

const logger = require("./utils/logger");
const app = require("./app");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`server running on port ${config.PORT}`);
});
