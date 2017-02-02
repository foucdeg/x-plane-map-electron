const $ = require('jquery');

let config = require('./config').getSync();
const period = 1000; //time between refreshes in ms

var mapOptions = {
  center: { lat: 0,lng: 0},
  zoom: 8
};
var map;

var polyOptions = {
  geodesic: true,
  strokeColor: '#000000',
  strokeOpacity: 1.0,
  strokeWeight: 2
};

var markerOptions = {
  icon: {
    path: "M250.2,59.002c11.001,0,20.176,9.165,20.176,20.777v122.24l171.12,95.954v42.779l-171.12-49.501v89.227l40.337," +
    "29.946v35.446l-60.52-20.18-60.502,20.166v-35.45l40.341-29.946v-89.227l-171.14,49.51v-42.779l171.14-95.954v-" +
    "122.24c0-11.612,9.15-20.777,20.16-20.777z",
    scale: 0.1,
    fillOpacity: 1,
    anchor: new google.maps.Point(250,250),
    strokeWeight: 0.5
  }
};

var planeList = {};
var refreshControlPanel = false;
var planeToFollow = null;
var colors = ["#26764E","#F08526","#9CFF54","#721B49","#A7D8F8","#2AFDBC","#FBE870","#711302","#2572C2",
"#1C271D","#632E85","#1E5F7A","#D8B2F5","#D307A2","#F391B5","#F180F5","#3A1E2E","#AE7707","#3E3D0E","#6AB06E"];
var colorIndex = 0;
var navMap;

var mapServerURL;

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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
    mapServerURL = config.remoteServerIP + ':' + config.remoteMapServerPort;
  }
  else {
    mapServerURL = 'http://localhost:' + config.mapServerPort;
  }

  updatePosition();
  setInterval(updatePosition, period);
  //load initial plane data and place planes

  //nav data overlays
  navMap = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      let tileSize = 256/Math.pow(2,zoom);
      let west = coord.x * tileSize;
      let east = west + tileSize;
      let north = coord.y * tileSize;
      let south = north + tileSize;

      let northEast = map.getProjection().fromPointToLatLng(new google.maps.Point(east, north));
      let southWest = map.getProjection().fromPointToLatLng(new google.maps.Point(west, south));

      return [
        config.mapTilesUrl,
        '?north=', northEast.lat().toFixed(4),
        '&south=', southWest.lat().toFixed(4),
        '&east=',  northEast.lng().toFixed(4),
        '&west=',  southWest.lng().toFixed(4)
      ].join('');
    },
    tileSize: new google.maps.Size(256, 256),
    minZoom : 6,
    maxZoom : 12
  });

  map.overlayMapTypes.push(navMap);
  navMap.setOpacity(0);
}

function updatePosition() {
  $.getJSON(mapServerURL + '/data')
  .then(function(data) {
    if (data === {}) {
      showError("No planes were detected. Please check X-Plane's data output and internet settings," +
      " and make sure that everyone's firewall allows inbound and outbound UDP traffic to port 49003.");
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
  markerOptions.icon.fillColor = color;
  let planeInfo = {
    name : ip.replace(/-/g, '.'),
    marker : new google.maps.Marker(markerOptions),
    trace: new google.maps.Polyline(polyOptions),
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
      '<strong class="plane-name">' + planeList[ip].name +'</strong><br>' +
      '<span class="altText">' + planeList[ip].altitude.toFixed() + ' ft</span> | <span class="hdgText">' + (planeList[ip].heading + 360).toFixed() % 360 + '&deg;</span> | <span class="spdText">GS ' + planeList[ip].speed.toFixed() + ' kts</span>' +
      '</td>' +
      '<td title="Click to show or hide trace."><input type="checkbox" class="trace-show" checked></td>' +
      '<td title="Click to reset the plane\'s trace."><button class="trace-clear">Clr</button></td>' +
      '<td title="Click to remove the plane."><button class="plane-remove" >Rm</button></td>' +
      '</tr>'
		);
  }

  //resetting js events
  //radio button
  $('input[name=plane]').change(function() {
    $('.planeRow').removeClass("followed");
    $('input[name=plane]:checked').parents('tr').addClass("followed");
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
    planeList[ip].trace = new google.maps.Polyline(polyOptions);
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
  $('.plane-name').dblclick(function() {
    ip = $(this).parents('.planeRow').data("ip");
    theName = planeList[ip].name;
    $(this).replaceWith($('<input/>', {value: theName, id: 'planeNameInput', 'data-ip': ip}).val(theName));

    $('#planeNameInput').select().keyup(function(e){
      if(e.keyCode == 13) // return key: confirm name
      {
        theNewName = $(this).val();
        theIP = $(this).data('ip');
        planeList[theIP].name = theNewName;
        refreshCP();
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
  $('#errorBox').text(text);
  $('#errorBox').fadeIn().delay(3500).fadeOut();
}

function nextColor() {
  if (colors[colorIndex]) {
    colorIndex++;
    return colors[colorIndex];
  }
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
$(document).ready(initialize)
