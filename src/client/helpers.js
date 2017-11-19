/* globals document */

const BASE_PLANE = {
  isTraceActive: true,
  path: [],
};

function makeNewPlane(oldPlane, newData, ip) {
  const {
    name, longitude, latitude, altitude, speed, heading, icon,
  } = newData;

  const newPlane = {
    ...oldPlane,
    icon,
    path: Array.from(oldPlane.path),
    name,
    altitude,
    speed,
    heading,
    position: [latitude, longitude],
  };

  newPlane.path.push({
    lat: latitude,
    lng: longitude,
    alt: altitude,
  });

  if (!newPlane.ip && ip) newPlane.ip = ip;

  return newPlane;
}

export function mergePlaneData(oldState, newPlanesData) {
  const newState = [];

  // update all pre-existing planes with their current data
  oldState.forEach((oldPlane) => {
    if (!(oldPlane.ip in newPlanesData)) return;
    newState.push(makeNewPlane(oldPlane, newPlanesData[oldPlane.ip]));
  });

  // add new planes
  Object.keys(newPlanesData).forEach((ip) => {
    const oldPlaneIndex = oldState.findIndex(_plane => _plane.ip === ip);
    if (oldPlaneIndex === -1) {
      const newPlane = makeNewPlane(BASE_PLANE, newPlanesData[ip], ip);
      newState.push(newPlane);
    }
  });

  return newState;
}

export function togglePlaneTrace(oldState, ip) {
  const newState = Array.from(oldState);

  oldState.forEach((plane, index) => {
    if (plane.ip === ip) {
      newState[index].isTraceActive = !plane.isTraceActive;
    }
  });

  return newState;
}

export function clearPlaneTrace(oldState, ip) {
  const newState = Array.from(oldState);

  oldState.forEach((plane, index) => {
    if (plane.ip === ip) {
      newState[index].path = [];
    }
  });

  return newState;
}

export function renamePlane(oldState, ip, name) {
  const newState = Array.from(oldState);

  oldState.forEach((plane, index) => {
    if (plane.ip === ip) {
      newState[index].name = name;
    }
  });
  return oldState;
}

export function changePlaneIcon(oldState, ip, icon) {
  const newState = Array.from(oldState);

  oldState.forEach((plane, index) => {
    if (plane.ip === ip) {
      newState[index].icon = icon;
    }
  });
  return oldState;
}

export function decodeConfig() {
  const config = document.location.search
    .substring(1)
    .split('&')
    .map(decodeURIComponent)
    .reduce((accumulator, fragment) => {
      const [key, value] = fragment.split('=');

      return {
        ...accumulator,
        [key]: value || true,
      };
    }, {});

  if (config.mode === 'remote') {
    config.mapServerURL = `http://${config.remoteServerIP}:${config.remoteMapServerPort}`;
  } else {
    config.mapServerURL = `http://${config.localIP}:${config.mapServerPort}`;
  }

  return config;
}
