import express from 'express';
import _ from 'lodash';
import path from 'path';
import config from './config';

const headers = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  next();
};

const formatPlaneData = (planeList) => {
  return _.mapValues(planeList, function(item) {
    return _.pick(item, ['name', 'altitude', 'longitude', 'latitude', 'speed', 'heading', 'icon']);
  });
};

export default class MapServer {
  constructor(appPath, planeList) {
    this.planeList = planeList;
    this.app = express();
    this.app.use(express.static(path.join(appPath, 'app')));

    this.app.use('/api', require('body-parser').json());
    this.app.use('/api', headers);

    this.app.get('/', (req, res, next) => {
      req.url = '/mobile.html';
      this.app.handle(req, res);
    });

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
      this.server = require('http').createServer(this.app)
      this.server.listen(port, null, null, () => {
        console.log(`Map server now listening on port ${port}`);
      });
    })
  }

  stopListening(callback) {
    if (this.server && this.server.listening) {
      this.server.close(() => {
        if (callback) callback();
      });
    }
    else if (callback) callback();
  }
}
