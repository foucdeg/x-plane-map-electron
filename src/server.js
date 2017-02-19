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
    return _.pick(item, ['name', 'altitude', 'longitude', 'latitude', 'speed', 'heading']);
  });
}

export default class MapServer {
  constructor(planeList) {
    this.planeList = planeList;
    this.app = express();
    this.app.use(express.static('./app'));

    this.app.use('/api', require('body-parser').json());
    this.app.use('/api', headers);

    this.app.get('/', (req, res, next) => {
      req.url = '/mobile.html';
      this.app.handle(req, res);
    });

    this.app.get('/api/data', (req, res) => {
      res.send(JSON.stringify(removePositionHistory(this.planeList)));
    });

    this.app.get('/api/config', (req, res) => {
      res.send(JSON.stringify(config.getSync()));
    });

    this.app.get('/static-config.js', (req, res) => {
      res.setHeader('Content-Type', 'text/javascript');
      res.send('window.config = ' + JSON.stringify(config.getSync()) + ';');
    });

    this.app.post('/api/rename', (req, res) => {
      if (!(req.body.name && req.body.ip && this.planeList[req.body.ip])) {
        return res.sendStatus(400);
      }
      this.planeList[req.body.ip].name = req.body.name;
      res.sendStatus(201);
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
