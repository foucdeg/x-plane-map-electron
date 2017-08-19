import $ from 'jquery';
import url from 'url';
let config = require('electron').remote.require('./config');
let hash = document.location.hash.substring(1);

$(document).ready(() => {
  $(window).bind('hashchange', changeTab);

  fillConfig()
  changeTab();
  $('#mapServerConnectionFailure').hide();
  $('#mapServerConnectionSuccess').hide();
});

function changeTab() {
  hash = document.location.hash.substring(1);
  $('section').hide();
  $(document).find('section[data-section-id="' + hash + '"]').show();

  $('nav a').removeClass('active');
  $('nav').find('a[href="#' + hash + '"]').addClass('active');
}

function fillConfig() {
  $(document).find('[data-bind]').each(function() {
    let configOption = $(this).attr('data-bind');
    $(this).text(config.getSync(configOption));
  });
  $(document).find('[data-bind-value]').each(function() {
    let configOption = $(this).attr('data-bind-value');
    $(this).val(config.getSync(configOption));
  });
}

$('#remoteConfigForm').submit(function(evt) {
  evt.preventDefault();
  let values = $(this).serializeArray();
  let ip = values[0].value;
  let port = values[1].value;
  if (!validateIP(ip)) return alert('The IP you entered is not a valid IPv4.');
  if (!validatePort(port)) return alert('The port you entered is not valid. It should be an integer between 1 and 65535.');

  $.get('http://' + ip + ':' + port + '/api/config')
  .then(function (remoteConfig) {
    config.setSync('remoteServerIP', ip);
    config.setSync('remoteMapServerPort', parseInt(port));
    config.setSync('remoteXPlanePort', remoteConfig.xPlanePort);
    fillConfig();
    $('#mapServerConnectionSuccess').show();
    $('#mapServerConnectionFailure').hide();
  })
  .catch(function() {
    $('#mapServerConnectionFailure').show();
    $('#mapServerConnectionSuccess').hide();
  });
});

$('#localConfigForm').submit(function(evt) {
  evt.preventDefault();
  let values = $(this).serializeArray();
  let xPlanePort = values[0].value;
  let mapServerPort = values[1].value;
  let mapTilesUrl = values[2].value;

  if (!validatePort(xPlanePort)) return alert('The X-Plane port you entered is not valid. It should be an integer between 1 and 65535.');
  if (!validatePort(mapServerPort)) return alert('The map server port you entered is not valid. It should be an integer between 1 and 65535.');

  config.setSync('xPlanePort', parseInt(xPlanePort));
  config.setSync('mapServerPort', parseInt(mapServerPort));
  config.setSync('mapTilesUrl', mapTilesUrl);
  fillConfig();
});

$('#configReset').click(function() {
  config.resetToDefaults();
  fillConfig();
});

$('.submit-button').click(() => {
  if (hash == 'multi-client') {
    config.setSync('mode', 'remote');
  } else {
    config.setSync('mode', 'local');
  }
  document.location.replace(url.format({
    pathname: document.location.pathname.replace('setup.html', 'app.html'),
    protocol: 'file:',
    slashes: true,
    query: { ...config.getSync() }
  }));
});

function validateIP(ip) {
  return ip.match(/^(\d{1,3}\.){3}\d{1,3}$/);
}

function validatePort(port) {
  let intPort = parseInt(port);
  return intPort > 0 && intPort < 65536;
}
