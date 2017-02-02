import express from 'express';
let config = require('./config');
let _ = require('lodash');

let headers = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  next()
};

let removePositionHistory = (planeList) => {
  return _.mapValues(planeList, function(item) {
    return _.pick(item, ['altitude', 'longitude', 'latitude', 'speed', 'heading']);
  });
}

export default class MapServer {
  constructor(planeList) {
    this.planeList = planeList;
    this.app = express();
    this.app.use(headers);

    this.app.get('/data', (req, res) => {
      res.send(JSON.stringify(removePositionHistory(this.planeList)));
    });

    this.app.get('/config', (req, res) => {
      res.send(JSON.stringify(config.getSync()));
    });

    this.listening = false;
  }

  listen(port) {
    this.stopListening(() => {
      this.server = require('http').createServer(this.app)
      this.server.listen(port, null, null, () => {
        console.log('Map server now listening on port ' + port);
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
