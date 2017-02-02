import { app, shell, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

let baseMenu = require('electron-default-menu')(app, shell);

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
}

export default baseMenu;
