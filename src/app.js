import { PERIOD, MAP_OPTIONS, POLY_OPTIONS, MARKER_OPTIONS, COLORS, NAV_OVERLAY_OPTIONS, getTileUrlFunction } from './constants';
import $ from 'jquery';
import electron from 'electron';
import qrcode from 'qrcode-js';

import './stylesheets/map.less';

let map;
let config;
let planeList = {};
let refreshControlPanel = false;
let planeToFollow = null;
let colorIndex = 0;
let navMap;
let isErrorShowing = false;
let mapServerURL;

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), MAP_OPTIONS);

  if ($('#code').length) {
    var code = qrcode.toDataURL('http://' + config.localIP + ':' + config.mapServerPort, 4);
    $('#code').attr('src', code);
  }

  google.maps.event.addListener(map, 'dragstart', function() {
    $('#nofocus').click();
  });

  $('body').keyup(function(e) {
    if (e.keyCode == 9) {
      if ($('#panel').is(":hidden" )) {
        showPanel();
      }
      else hidePanel();
    }
    if (e.keyCode == 78) {
      if (navMap.getOpacity()) {
        hideNavaids();
      }
      else showNavaids();
    }
  });

  $('input[name=plane]').change(function() {
    $('.planeRow').removeClass("followed");
    $('input[name=plane]:checked').parents('.planeRow').addClass("followed");
  });
  $('#panel-button').click(showPanel);
  $('#navaids-button').click(showNavaids);

  if (config.mode === 'remote') {
    mapServerURL = 'http://' + config.remoteServerIP + ':' + config.remoteMapServerPort;
  }
  else {
    mapServerURL = 'http://' + config.localIP + ':' + config.mapServerPort;
  }

  updatePosition();
  setInterval(updatePosition, PERIOD);
  //load initial plane data and place planes

  //nav data overlays
  let navOverlayOptions = Object.assign({}, NAV_OVERLAY_OPTIONS);
  navOverlayOptions.tileSize = new google.maps.Size(250, 250);
  navOverlayOptions.getTileUrl = getTileUrlFunction(map, google, config.mapTilesUrl);
  navMap = new google.maps.ImageMapType(navOverlayOptions);
  navMap.setOpacity(0);
  map.overlayMapTypes.push(navMap);
}

function updatePosition() {
  $.getJSON(mapServerURL + '/api/data')
  .then(function(data) {
    if ($.isEmptyObject(data)) {
      showError("No planes were detected. Please check X-Plane's data output and internet settings," +
      " and make sure that the map server's firewall allows inbound UDP traffic to port " + config.xPlanePort + '.');
    }

    //delete all absent planes
    for (var ip in planeList) {
      if (!(ip in data)) {
        deletePlane(ip);
        refreshControlPanel = true;
      }
    }

    //for current and new planes
    for (var ip in data) {
      if (!(ip in planeList)) {
        // new plane
        planeList[ip] = initializePlane(ip, data[ip]);
        planeToFollow = ip;
        refreshControlPanel = true;
      }
      Object.assign(planeList[ip], data[ip]);

      let newPoint = new google.maps.LatLng(data[ip].latitude, data[ip].longitude);

      //set marker position to new point
      planeList[ip].marker.setPosition(newPoint);

      //rotate marker
      let icon = planeList[ip].marker.getIcon();
      icon.rotation = planeList[ip].heading;
      planeList[ip].marker.setIcon(icon);

      // add new point to line
      planeList[ip].trace.getPath().push(newPoint);

      //set info window content
      planeList[ip].info.setContent(
        '<div style="margin: 0; width: 150px;"><strong>' + planeList[ip].name + '</strong><br>' +
        planeList[ip].altitude.toFixed() + ' ft MSL / ' + (planeList[ip].heading).toFixed() % 360 + '&deg;<br>' +
        'GS ' + planeList[ip].speed.toFixed() + ' kts</div>'
      );

      //set table content
      $('.planeRow[data-ip="' + ip +'"] .planeName').html(planeList[ip].name);
      $('.planeRow[data-ip="' + ip +'"] .altText').html(planeList[ip].altitude.toFixed() + ' ft');
      $('.planeRow[data-ip="' + ip +'"] .hdgText').html((planeList[ip].heading).toFixed() % 360 + '&deg;');
      $('.planeRow[data-ip="' + ip +'"] .spdText').html('GS ' + planeList[ip].speed.toFixed() + ' kts');
    }

    // move map if checkbox checked
    if (planeToFollow != null)  map.panTo( new google.maps.LatLng( planeList[planeToFollow].latitude, planeList[planeToFollow].longitude ));

    if (refreshControlPanel) refreshCP();
  })
  .catch(function(err) {
    console.error(err);
    showError('There seems to be an issue with the app. Please try to restart');
  });
}

function initializePlane(ip, data) {
  let color = nextColor();
  // markerOptions.icon.fillColor = color;
  let markerOptions = Object.assign({}, MARKER_OPTIONS);
  markerOptions.icon.fillColor = color;
  markerOptions.icon.anchor = new google.maps.Point(250,250);

  let planeInfo = {
    marker : new google.maps.Marker(markerOptions),
    trace: new google.maps.Polyline(POLY_OPTIONS),
    info: new google.maps.InfoWindow(),
    color: color
  };

  //setup marker
  planeInfo.marker.setMap(map);
  planeInfo.marker.ip = ip; //this is necessary for the browser to know which info window to open
  //setup marker click event
  planeInfo.infoWindowListener = google.maps.event.addListener(
    planeInfo.marker, 'click',
    function() {
      planeList[this.ip].info.open(map, planeList[this.ip].marker);
    }
  );

  //setup trace polyline
  planeInfo.trace.setMap(map);
  return planeInfo;
}

//clean plane deletion
function deletePlane(ip) {
  google.maps.event.removeListener(planeList[ip].infoWindowListener);
  planeList[ip].trace.setMap(null);
  planeList[ip].marker.setMap(null);
  delete planeList[ip];
}

//refresh control panel
function refreshCP() {
  $('.planeRow').remove();
  for (var ip in planeList) {
    $("#planesTable").append(
      '<tr class="planeRow' + ((planeToFollow == ip) ? ' followed' : '') + '" data-ip="' + ip + '">' +
      '<td style="background-color: ' + planeList[ip].color + ';"title="Click to focus on this plane."><label><input type="radio" name="plane"></label></td>' +
      '<td title="Double-click to rename.">' +
      '<strong class="planeName">' + planeList[ip].name +'</strong><br>' +
      '<span class="altText">' + planeList[ip].altitude.toFixed() + ' ft</span> | <span class="hdgText">' + (planeList[ip].heading + 360).toFixed() % 360 + '&deg;</span> | <span class="spdText">GS ' + planeList[ip].speed.toFixed() + ' kts</span>' +
      '</td>' +
      '<td title="Click to show or hide trace."><input type="checkbox" class="trace-show" checked></td>' +
      '<td title="Click to reset the plane\'s trace."><button class="trace-clear">Clr</button></td>' +
      '<td title="Click to remove the plane."><button class="plane-remove">Rm</button></td>' +
      '</tr>'
		);
  }

  //resetting js events
  //radio button
  $('input[name=plane]').change(function() {
    $('.planeRow').removeClass("followed");
    $('input[name=plane]:checked').parents('.planeRow').addClass("followed");
    ip = $('input[name=plane]:checked').parents('tr').data("ip");
    planeToFollow = ip;
    if (ip != null) map.panTo( new google.maps.LatLng( planeList[ip].latitude, planeList[ip].longitude ) );
  });

  //hide/show trace checkbox
  $('.trace-show').change(function() {
    ip = $(this).parents('.planeRow').data("ip");
    planeList[ip].trace.setVisible($(this).is(':checked'));
  });

  //trace clear button
  $('.trace-clear').click(function() {
    ip = $(this).parents('.planeRow').data("ip");
    planeList[ip].trace.setMap(null);
    planeList[ip].trace = new google.maps.Polyline(POLY_OPTIONS);
    planeList[ip].trace.setMap(map);
    planeList[ip].trace.getPath().push(new google.maps.LatLng( planeList[ip].latitude, planeList[ip].longitude ));
  });

  //plane remove button
  $('.plane-remove').click(function() {
    if(confirm('Are you sure you want to remove this plane ?')) {
      ip = $(this).parents('.planeRow').data("ip");
      deletePlane(ip);
      refreshCP();
    }
  });

  //plane name edition
  $('.planeName').dblclick(function() {
    let theIP = $(this).parents('.planeRow').data("ip");
    let theName = planeList[ip].name;
    $(this).replaceWith($('<input/>', {value: theName, id: 'planeNameInput', 'data-ip': theIP}).val(theName));

    $('#planeNameInput').select().keyup(function(e){
      if(e.keyCode == 13) // return key: confirm name
      {
        let theNewName = $(this).val();
        let theIP = $(this).data('ip');
        $.ajax(mapServerURL + '/api/rename', {
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            ip: theIP,
            name: theNewName
          })
        })
        .then(() => {
          planeList[theIP].name = theNewName;
          refreshCP();
        });
      }
      else if(e.keyCode == 27 ) { // escape key: cancel change
        refreshCP();
      }
    });
  });

  $('#planesTable tr td:nth-child(2)').click(function() {
    $(this).parents('tr').find('input[name=plane]').click();
  });

  refreshControlPanel = false;
}

//alert() equivalent
function showError(text) {
  if (!isErrorShowing) {
    isErrorShowing = true;
    $('#errorBox').text(text).fadeIn().delay(3500).fadeOut(function() {
      isErrorShowing = false;
    });
  }
}

function nextColor() {
  let color = COLORS[++colorIndex];
  if (color) return color;
  console.log("No more colors");
  return "#aaaaaa";
}

function hidePanel() {
  $('#panel').animate({'right' : '-300px'}, 400, 'swing', function() {
    $('#panel-button').html('Show panel (Tab)').unbind('click').click(showPanel);
    $('#panel').hide();
    google.maps.event.trigger(map, 'resize');
  });
  $('#map-canvas-wrapper').animate({'margin-right' : '0px'});
}

function showPanel() {
  $('#panel').show();
  $('#panel').animate({'right' : '0px'}, 400, 'swing', function() {
    $('#panel-button').html('Hide panel (Tab)').unbind('click').click(hidePanel);
    google.maps.event.trigger(map, 'resize');
  });
  $('#map-canvas-wrapper').animate({'margin-right' : '300px'});
}

function hideNavaids() {
  $('#navaids-button').html('Show navaids (N)').unbind('click').click(showNavaids);
  navMap.setOpacity(0);
}

function showNavaids() {
  $('#navaids-button').html('Hide navaids (N)').unbind('click').click(hideNavaids);
  navMap.setOpacity(1);
}

//ready when you are!
window.onload = function() {
  config = electron.remote.require('./config').getSync();
  initialize();
}
