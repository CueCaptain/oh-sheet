import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import nms from './LiveStreamServer.js';
import ServerData from './services/ServerData.js';

import {router as genericRouter} from './routes/genericRouter.js';
import {router as cuesheetRouter} from './routes/cuesheetRouter.js';
import {router as mediaServerRouter} from './routes/mediaServerRouter.js';

console.info('Initializing server.');

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

// json middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.raw({inflate: true, limit: '1mb', type: 'text/plain'}));

// Implement route for errors
app.use((err, req, res, next) => {
  res.status(500).send(err.stack);
});

//router
app.use('/', genericRouter);
app.use('/cuesheet', cuesheetRouter);
app.use('/mediaserver', mediaServerRouter);

console.info('Creating server.');
const server = http.createServer(app);

export const serveApp = async () => {
  const port = 4001;
  console.info(`Starting server on port ${port}.`);
  server.listen(port, '0.0.0.0');
  console.info('Starting websocket Server');
  global.serverData = new ServerData(server);
  nms.run();
  return true;
};

export const shutdownApp = async () => {
  console.info('Shutting down server');
  server.close();
};

process.once('SIGHUP', shutdownApp);
process.once('SIGINT', shutdownApp);
process.once('SIGTERM', shutdownApp);

serveApp();
