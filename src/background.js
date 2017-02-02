import path from 'path';
import url from 'url';
import { app, Menu, shell } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import createWindow from './helpers/window';
import UDPListener from './udp';
import MapServer from './server';
let config = require('./config');
require('electron-context-menu')();

let planesList = {};
let mapServer = new MapServer(planesList);
let udpClient = new UDPListener(planesList);
let mainWindow;

app.on('ready', function () {
  var mainWindow = createWindow('main', {
    width: 1000,
    height: 800,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'setup.html'),
    protocol: 'file:',
    slashes: true,
    hash: '#single'
  }));

  if (config.getSync('mode') === 'local') {
    mapServer.listen(config.getSync('mapServerPort'));
    udpClient.listen(config.getSync('xPlanePort'));
  }
});

app.on('window-all-closed', function () {
  app.quit();
});

config.on('mapServerPortChange', function(mapServerPort) {
  mapServer.listen(mapServerPort);
});
config.on('xPlanePortChange', function(xPlanePort) {
  udpClient.listen(xPlanePort);
});
config.on('modeChange', function(mode) {
  if (mode === 'local') {
    mapServer.listen(config.getSync('mapServerPort'));
    udpClient.listen(config.getSync('xPlanePort'));
  }
  else {
    mapServer.stopListening();
    udpClient.stopListening();
  }
});
