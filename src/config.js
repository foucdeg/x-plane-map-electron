import ip from 'ip';
import config from 'electron-settings';

config.defaults({
  xPlanePort: 49003,
  mapServerPort: 8080,
  mode: 'local',
  remoteServerIP: null,
  remoteXPlanePort: 49003,
  remoteMapServerPort: 8080,
});
let xPlanePort = config.getSync('xPlanePort');
let mapServerPort = config.getSync('mapServerPort');
let mode = config.getSync('mode');

config.setSync('localIP', ip.address());

config.on('write', () => {
  const newXPlanePort = config.getSync('xPlanePort');
  const newMapServerPort = config.getSync('mapServerPort');
  const newMode = config.getSync('mode');
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

export default config;
