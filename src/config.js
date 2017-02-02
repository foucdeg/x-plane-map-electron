let ip = require('ip');
let config = require('electron-settings');

config.defaults({
  xPlanePort: 49003,
  mapServerPort: 8080,
  mapTilesUrl: 'http://x-plane-map.fouc.net/nav.php',
  mode: 'local',
  remoteServerIP: null,
  remoteXPlanePort: 49003,
  remoteMapServerPort: 8080
});
let xPlanePort = config.getSync('xPlanePort');
let mapServerPort = config.getSync('mapServerPort');
let mode = config.getSync('mode');

config.setSync('localIP', ip.address());

config.on('write', () => {
  let newXPlanePort = config.getSync('xPlanePort');
  let newMapServerPort = config.getSync('mapServerPort');
  let newMode = config.getSync('mode');
  if (xPlanePort !== newXPlanePort) {
    xPlanePort = newXPlanePort;
    config.emit('xPlanePortChange', xPlanePort);
  }
  if (mapServerPort !== newMapServerPort) {
    mapServerPort = newMapServerPort;
    config.emit('mapServerPortChange', mapServerPort);
  }
  if (mode !== newMode) {
    mode = newMode;
    config.emit('modeChange', mode);
  }
});

module.exports = config;
