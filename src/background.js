import path from 'path';
import url from 'url';
import { app, Menu, shell } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import createWindow from './helpers/window';
import UDPListener from './udp';
import MapServer from './server';
//import config from './config';
let config = require('./config');

require('electron-context-menu')();

import env from './env';

var mainWindow;

if (env.name !== 'production') {
  var userDataPath = app.getPath('userData');
  app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

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
});

app.on('window-all-closed', function () {
  app.quit();
});

var planesList = {};
var mapServer = new MapServer(planesList).listen(config.getSync('mapServerPort'));
var udpClient = new UDPListener(planesList).listen(config.getSync('xPlanePort'));
