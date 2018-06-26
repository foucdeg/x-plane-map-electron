/* eslint-disable import/no-extraneous-dependencies */
import url from 'url';
import { app, Menu, ipcMain, autoUpdater } from 'electron';
import electronContextMenu from 'electron-context-menu';
import createWindow from './helpers/window';
import UDPListener from './udp';
import MapServer from './server';
import menuTemplate from './menu/menu';
import config from './config';
import isPortAvailable from './helpers/net';

const loadConfig = () => {
  const currentConfig = config.getSync();
  return Promise.all([
    isPortAvailable(currentConfig.xPlanePort),
    isPortAvailable(currentConfig.mapServerPort),
  ]).then((arePortsValid) => {
    const isConfigValid = arePortsValid[0] && arePortsValid[1];
    return {
      ...currentConfig,
      isConfigValid,
    };
  });
};

electronContextMenu();

const planesList = {};

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

  ipcMain.on('start', (event, mode) => {
    if (mode === 'local') {
      app.mapServer = new MapServer(app.getAppPath(), planesList);
      app.mapServer.listen(config.getSync('mapServerPort'));

      app.udpClient = new UDPListener(planesList);
      app.udpClient.listen(config.getSync('xPlanePort'));
    }
  });

  const server = 'https://updates.xmap.fouc.net';
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

  autoUpdater.setFeedURL(feed);

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60000);

  /*
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    // autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application');
    console.error(message);
  });
  */
});

app.on('window-all-closed', () => app.quit());

ipcMain.on('getConfig', (event) => {
  loadConfig().then(currentConfig => event.sender.send('getConfigResponse', currentConfig));
});

ipcMain.on('setConfig', (event, newConfig) => {
  Object.keys(newConfig).forEach(key => config.setSync(key, newConfig[key]));
  loadConfig().then(currentConfig => event.sender.send('setConfigResponse', currentConfig));
});

ipcMain.on('checkPort', (event, port) => {
  isPortAvailable(port).then((result) => {
    event.sender.send('checkPortResponse', port, result);
  });
});
