/* eslint-disable import/no-extraneous-dependencies */
import { app, shell, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

function openAboutWindow() {
  const window = new BrowserWindow({
    width: 400,
    height: 400,
    useContentSize: true,
    titleBarStyle: 'hidden-inset',
  });
  window.loadURL(url.format({
    pathname: path.join(app.getAppPath(), 'app', 'about.html'),
    protocol: 'file:',
    slashes: true,
  }));

  window.once('ready-to-show', () => {
    window.show();
  });
}

function goToSettings() {
  app.mapServer.stopListening();
  app.udpClient.stopListening();

  BrowserWindow.getFocusedWindow().loadURL(url.format({
    pathname: path.join(app.getAppPath(), 'app', 'setup.html'),
    protocol: 'file:',
    slashes: true,
    hash: '#single',
  }));
}

const baseMenuBuilder = require('electron-default-menu');

const baseMenu = baseMenuBuilder(app, shell);

if (process.platform === 'win32') {
  baseMenu[1].submenu.push({ type: 'separator' });
  baseMenu[1].submenu.push({ label: 'Settings...', click: goToSettings });

  baseMenu[baseMenu.length - 1].submenu.splice(0, 0, {
    label: 'About X-Plane-Map',
    click: openAboutWindow,
  });
}

if (process.platform === 'darwin') {
  const prefs = {
    label: 'Preferences',
    accelerator: 'Command+,',
    click: goToSettings,
  };
  baseMenu[0].submenu.splice(2, 0, prefs, { type: 'separator' });

  const aboutMenu = {
    label: 'About X-Plane-Map',
    accelerator: 'Command+I',
    click: openAboutWindow,
  };
  baseMenu[0].submenu[0] = aboutMenu;
}

export default baseMenu;
