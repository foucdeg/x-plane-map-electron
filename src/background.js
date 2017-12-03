import path from 'path';
import url from 'url';
import { app, Menu, ipcMain } from 'electron';
import createWindow from './helpers/window';
import UDPListener from './udp';
import MapServer from './server';
import menuTemplate from './menu/menu';
import electronContextMenu from 'electron-context-menu';

electronContextMenu();

import config from './config';

let planesList = {};
let mapServer = new MapServer(app.getAppPath(), planesList);
let udpClient = new UDPListener(planesList);
let mainWindow;

app.on('ready', function () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  var mainWindow = createWindow('main', {
    width: 1000,
    height: 800,
  });

  mainWindow.loadURL(url.format({
    pathname: app.getAppPath() + '/app/setup.html',
    protocol: 'file:',
    slashes: true,
    hash: '#single',
  }));

  if (config.getSync('mode') === 'local') {
    mapServer.listen(config.getSync('mapServerPort'));
    udpClient.listen(config.getSync('xPlanePort'));
  }
});

app.on('window-all-closed', function () {
  app.quit();
});

ipcMain.on('getConfig', (event) => {
  event.returnValue = config.getSync();
});

ipcMain.on('setConfig', (event, newConfig) => {
  for (let key in newConfig) {
    config.setSync(key, newConfig[key]);
  }
  event.returnValue = config.getSync();
});

ipcMain.on('resetConfig', (event, newConfig) => {
  config.resetToDefault();
  event.returnValue = config.getSync();
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
