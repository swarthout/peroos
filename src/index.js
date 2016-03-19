'use strict';

const app = require('./app');
const port = 3000;
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on localhost:${port}`)
);
