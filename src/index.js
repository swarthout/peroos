'use strict';

const app = require('./app');
const port = 5000;
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on localhost:${port}`)
);
