/* eslint no-console: "off" */

import express from 'express';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import config from './config';

const headers = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  next();
};

let socketId = 0;

const formatPlaneData = planeList =>
  mapValues(
    planeList,
    item => pick(item, ['name', 'altitude', 'longitude', 'latitude', 'speed', 'heading', 'icon']),
  );

export default class MapServer {
  constructor(appPath, planeList) {
    this.planeList = planeList;
    this.sockets = {};
    this.app = express();
    this.app.use(express.static(path.join(appPath, 'app')));

    this.app.use('/api', bodyParser.json());
    this.app.use('/api', headers);

    this.app.get('/api/data', (req, res) => {
      res.send(JSON.stringify(formatPlaneData(this.planeList)));
    });

    this.app.get('/api/config', (req, res) => {
      res.send(JSON.stringify(config.getSync()));
    });

    this.app.post('/api/rename', (req, res) => {
      if (!(req.body.name && req.body.ip && this.planeList[req.body.ip])) {
        return res.sendStatus(400);
      }
      this.planeList[req.body.ip].name = req.body.name;
      return res.sendStatus(201);
    });

    this.app.post('/api/change-icon', (req, res) => {
      if (!(req.body.icon && req.body.ip && this.planeList[req.body.ip])) {
        return res.sendStatus(400);
      }
      this.planeList[req.body.ip].icon = req.body.icon;
      return res.sendStatus(201);
    });

    this.listening = false;
  }

  listen(port) {
    this.stopListening(() => {
      this.server = http.createServer(this.app);
      this.server.on('connection', this.registerSocket.bind(this));
      this.server.listen(port, null, null, () => {
        console.log(`Map server now listening on port ${port}`);
      });
    });
  }

  registerSocket(socket) {
    const id = socketId++;
    this.sockets[id] = socket;
    socket.on('close', () => { delete this.sockets[id]; });
  }

  stopListening(callback) {
    if (this.server && this.server.listening) {
      this.server.close(() => {
        if (callback) callback();
        // this takes a while to happen as Chrome keeps connection open
        console.log('Map server no longer listening');
      });
      Object.keys(this.sockets).map(id => this.sockets[id].destroy());
    } else if (callback) callback();
  }
}
