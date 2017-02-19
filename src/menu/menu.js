import { app, shell, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import openAboutWindow from 'about-window';

let baseMenu = require('electron-default-menu')(app, shell);

baseMenu[baseMenu.length - 1].submenu.splice(0, 0, {
  label: 'About X-Plane-Map',
  click: () => openAboutWindow({
    icon_path: path.join(__dirname, '..', 'build', 'icons', '512x512.png')
  })
})

if (process.platform === 'darwin') {
  let prefs = {
    label: 'Preferences',
    accelerator: 'Command+,',
    click: function() {
      BrowserWindow.getFocusedWindow().loadURL(url.format({
        pathname: path.join(__dirname, 'setup.html'),
        protocol: 'file:',
        slashes: true,
        hash: '#single'
      }));
    }
  };
  baseMenu[0].submenu.splice(2, 0, prefs, { type: 'separator' });

  let aboutMenu = {
    label: 'About X-Plane-Map',
    accelerator: 'Command+I',
    click: () => openAboutWindow({
      icon_path: path.join(__dirname, '..', 'build', 'icons', '512x512.png')
    })
  };
  baseMenu[0].submenu[0] = aboutMenu;
}

export default baseMenu;
