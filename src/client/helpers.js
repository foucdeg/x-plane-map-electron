/* globals document */
const DEVIATION_THRESHOLD = 0.01; // square seconds
const FEET_IN_A_METER = 3.28;
const METERS_IN_A_LAT_DEGREE = 111319;
const METERS_IN_A_LON_DEGREE = 78850; // at 45 deg latitude
const METERS_SECONDS_IN_A_KNOT = 0.515;

const BASE_PLANE = {
  isTraceActive: true,
  path: [],
};

/**
 * Returns the square of the distance of B with respect to the line AC, an indication of whether
 * we are in a change of trajectory.
 */
function getSquareOffsetDistance(pointA, pointB, pointC) {
  // AB>
  const xAB = (pointB.lng - pointA.lng) * METERS_IN_A_LON_DEGREE;
  const yAB = (pointB.lat - pointA.lat) * METERS_IN_A_LAT_DEGREE;
  const zAB = (pointB.alt - pointA.alt) / FEET_IN_A_METER;
  // AC>
  const xAC = (pointC.lng - pointA.lng) * METERS_IN_A_LON_DEGREE;
  const yAC = (pointC.lat - pointA.lat) * METERS_IN_A_LAT_DEGREE;
  const zAC = (pointC.alt - pointA.alt) / FEET_IN_A_METER;
  // Cross-product
  const xCP = yAB * zAC - zAB * yAC;
  const yCP = zAB * xAC - xAB * zAC;
  const zCP = xAB * yAC - yAB * xAC;

  const squaredCrossProductNorm = xCP * xCP + yCP * yCP + zCP * zCP;
  const squaredAC = xAC * xAC + yAC * yAC + zAC * zAC;

  return squaredAC ? squaredCrossProductNorm / squaredAC : 0;
}

/**
 * This function determines whether the current path point should be kept between its predecessor
 * and the new point. If there is some deviation in direction or climb/descent rate, it should be
 * kept, to provide better path resoution; if not we can skip it.
 */
function shouldKeepCurrentPoint(previousPoint, currentPoint, nextPoint, speed) {
  if (!speed) return true;
  const speedInMetersSecond = speed * METERS_SECONDS_IN_A_KNOT;
  const squareOffsetDistance = getSquareOffsetDistance(previousPoint, currentPoint, nextPoint);
  const squaredOffsetTime = squareOffsetDistance / speedInMetersSecond / speedInMetersSecond;

  return squaredOffsetTime > DEVIATION_THRESHOLD;
}

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

  const newPathPoint = {
    lat: latitude,
    lng: longitude,
    alt: altitude,
  };

  if (newPlane.path.length < 2 || shouldKeepCurrentPoint(
    newPlane.path[newPlane.path.length - 2],
    newPlane.path[newPlane.path.length - 1],
    newPathPoint,
    speed,
  )) {
    newPlane.path.push(newPathPoint);
  } else {
    newPlane.path[newPlane.path.length - 1] = newPathPoint;
  }

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

export function formatLatLon([latitude, longitude]) {
  const northOrSouth = latitude > 0 ? 'N' : 'S';
  const eastOrWest = latitude > 0 ? 'E' : 'W';
  const latitudeText = Math.abs(latitude).toLocaleString('en-us', { maximumFractionDigits: 4 });
  const longitudeText = Math.abs(longitude).toLocaleString('en-us', { maximumFractionDigits: 4 });

  return `${latitudeText} ${northOrSouth}, ${longitudeText} ${eastOrWest}`;
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
