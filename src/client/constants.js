export const PERIOD = 1000;

export const POLYLINE_OPTIONS = {
  geodesic: true,
  options: {
    strokeColor: '#ff2527',
    strokeOpacity: 1.0,
    strokeWeight: 2
  }
};

export const MARKER_OPTIONS = {
  icon: {
    path: "M250.2,59.002c11.001,0,20.176,9.165,20.176,20.777v122.24l171.12,95.954v42.779l-171.12-49.501v89.227l40.337," +
    "29.946v35.446l-60.52-20.18-60.502,20.166v-35.45l40.341-29.946v-89.227l-171.14,49.51v-42.779l171.14-95.954v-" +
    "122.24c0-11.612,9.15-20.777,20.16-20.777z",
    scale: 0.1,
    fillOpacity: 1,
    strokeWeight: 0.5
  }
};

export const COLORS = [
  "#26764E","#F08526","#9CFF54","#721B49","#A7D8F8",
  "#2AFDBC","#FBE870","#711302","#2572C2","#1C271D",
  "#632E85","#1E5F7A","#D8B2F5","#D307A2","#F391B5",
  "#F180F5","#3A1E2E","#AE7707","#3E3D0E","#6AB06E"
];

export const NAV_OVERLAY_OPTIONS = {
  minZoom: 6,
  maxZoom: 12
};

export const getTileUrlFunction = (map, google, mapTilesUrl) => {
  return (coord, zoom) => {
    let tileSize = 256/Math.pow(2,zoom);
    let west = coord.x * tileSize;
    let east = west + tileSize;
    let north = coord.y * tileSize;
    let south = north + tileSize;

    let northEast = map.getProjection().fromPointToLatLng(new google.maps.Point(east, north));
    let southWest = map.getProjection().fromPointToLatLng(new google.maps.Point(west, south));

    return [
      mapTilesUrl,
      '?north=', northEast.lat().toFixed(4),
      '&south=', southWest.lat().toFixed(4),
      '&east=',  northEast.lng().toFixed(4),
      '&west=',  southWest.lng().toFixed(4)
    ].join('');
  };
};
