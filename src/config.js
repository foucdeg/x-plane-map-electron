let config = require('electron-settings');
config.defaults({
  xPlanePort: 49003,
  mapServerPort: 8080,
  mapTilesUrl: 'http://x-plane-map.fouc.net/nav.php'
});

module.exports = config;
