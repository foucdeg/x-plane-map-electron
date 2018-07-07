/* globals document */
/* eslint import/no-extraneous-dependencies: "off" */
import { ipcRenderer } from 'electron';
import url from 'url';

export const SET_CONFIG = Symbol('SET_CONFIG');
export const RESET_CONFIG = Symbol('RESET_CONFIG');

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
    pathname: document.location.pathname.replace('setup.html', 'app.html'),
    protocol: 'file:',
    slashes: true,
    query: config,
  }));
}
