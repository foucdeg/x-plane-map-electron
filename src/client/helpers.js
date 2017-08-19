import { COLORS, MARKER_OPTIONS, POLYLINE_OPTIONS } from './constants';

const BASE_PLANE = {
  isTraceActive: true,
  icon: {
    ...MARKER_OPTIONS.icon,
    anchor: new google.maps.Point(250,250)
  },
  trace: {
    ...POLYLINE_OPTIONS,
    path: []
  }
};

let colorIndex = 0;

function nextColor() {
  return COLORS[++colorIndex % COLORS.length];
}

function makeNewPlane(oldPlane, newData, ip) {
  let { name, longitude, latitude, altitude, speed, heading } = newData;

  let newPlane = {
    ...oldPlane,
    icon: { ...oldPlane.icon },
    trace: {
      ...oldPlane.trace,
      path: Array.from(oldPlane.trace.path)
    },
    name,
    altitude,
    speed,
    heading,
    position: new google.maps.LatLng(latitude, longitude)
  };

  newPlane.trace.path.push({ lat: latitude, lng: longitude });
  if (!newPlane.color) newPlane.color = nextColor();
  if (!newPlane.ip && ip) newPlane.ip = ip;

  return newPlane;
}

export function mergePlaneData(oldState, newPlanesData) {
  let newState = [];

  // update all pre-existing planes with their current data
  oldState.forEach(oldPlane => {
    if (!(oldPlane.ip in newPlanesData)) return;
    newState.push(makeNewPlane(oldPlane, newPlanesData[oldPlane.ip]));
  });

  // add new planes
  Object.keys(newPlanesData).forEach(ip => {
    let oldPlaneIndex = oldState.findIndex(_plane => _plane.ip === ip);
    if (oldPlaneIndex === -1) {
      let newPlane = makeNewPlane(BASE_PLANE, newPlanesData[ip], ip);
      newState.push(newPlane);
    }
  });

  return newState;
}

export function togglePlaneTrace(oldState, ip) {
  let newState = Array.from(oldState);

  oldState.forEach(plane => {
    if (plane.ip === ip) {
      plane.isTraceActive = !plane.isTraceActive;
    }
  });
  return oldState;
}

export function clearPlaneTrace(oldState, ip) {
  let newState = Array.from(oldState);

  oldState.forEach(plane => {
    if (plane.ip === ip) {
      plane.trace.path = [];
    }
  });
  return oldState;
}

export function decodeConfig() {
  let config = document.location.search
  .substring(1)
  .split('&')
  .map(decodeURIComponent)
  .reduce((accumulator, fragment) => {
    let [ key, value ] = fragment.split('=');
    accumulator[key] = value || true;
    return accumulator
  }, {});

  if (config.mode === 'remote') {
    config.mapServerURL = 'http://' + config.remoteServerIP + ':' + config.remoteMapServerPort;
  }
  else {
    config.mapServerURL = 'http://' + config.localIP + ':' + config.mapServerPort;
  }

  return config;
}
