/* globals document */
/* eslint import/no-extraneous-dependencies: "off" */
import { ipcRenderer } from 'electron';
import url from 'url';

export const SET_CONFIG = 'set_config';
export const RESET_CONFIG = 'reset_config';

export function loadConfig() {
  ipcRenderer.send('getConfig');
  return function loadConfigThunk(dispatch) {
    ipcRenderer.once('getConfigResponse', (event, config) => {
      dispatch({
        type: SET_CONFIG,
        data: config,
      });
    });
  };
}

export function setConfig(newConfig) {
  ipcRenderer.send('setConfig', newConfig);
  return function setConfigThunk(dispatch) {
    ipcRenderer.once('setConfigResponse', (event, config) => {
      dispatch({
        type: SET_CONFIG,
        data: config,
      });
    });
  };
}

export function start(config) {
  ipcRenderer.send('start', config.mode);
  document.location.replace(url.format({
    pathname: document.location.pathname.replace('setup.html', 'index.html'),
    protocol: 'file:',
    slashes: true,
    query: config,
  }));
}
