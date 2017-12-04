/* eslint-disable import/no-extraneous-dependencies */
import url from 'url';
import { app, Menu, ipcMain } from 'electron';
import electronContextMenu from 'electron-context-menu';
import createWindow from './helpers/window';
import UDPListener from './udp';
import MapServer from './server';
import menuTemplate from './menu/menu';
import config from './config';

electronContextMenu();

const planesList = {};
const mapServer = new MapServer(app.getAppPath(), planesList);
const udpClient = new UDPListener(planesList);

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 800,
  });

  mainWindow.loadURL(url.format({
    pathname: `${app.getAppPath()}/app/setup.html`,
    protocol: 'file:',
    slashes: true,
    hash: '#single',
  }));

  if (config.getSync('mode') === 'local') {
    mapServer.listen(config.getSync('mapServerPort'));
    udpClient.listen(config.getSync('xPlanePort'));
  }
});

app.on('window-all-closed', () => app.quit());

/* eslint-disable no-param-reassign */
ipcMain.on('getConfig', (event) => {
  event.returnValue = config.getSync();
});

ipcMain.on('setConfig', (event, newConfig) => {
  Object.keys(newConfig).forEach(key => config.setSync(key, newConfig[key]));
  event.returnValue = config.getSync();
});

ipcMain.on('resetConfig', (event) => {
  config.resetToDefault();
  event.returnValue = config.getSync();
});
/* eslint-enable no-param-reassign */

config.on('mapServerPortChange', mapServerPort => mapServer.listen(mapServerPort));
config.on('xPlanePortChange', xPlanePort => udpClient.listen(xPlanePort));
config.on('modeChange', (mode) => {
  if (mode === 'local') {
    mapServer.listen(config.getSync('mapServerPort'));
    udpClient.listen(config.getSync('xPlanePort'));
  } else {
    mapServer.stopListening();
    udpClient.stopListening();
  }
});
