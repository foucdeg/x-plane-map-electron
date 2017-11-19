/* eslint no-mixed-operators: "off" */

export default class Geo {
  constructor(tileSize = 256) {
    this.tileSize = tileSize;
    this.initialResolution = 2 * Math.PI * 6378137 / this.tileSize;
    this.originShift = 2 * Math.PI * 6378137 / 2.0;
  }

  getTileLatLngBounds(x, y, zoom) {
    const {
      minX, minY, maxX, maxY,
    } = this.getTileBounds(x, y, zoom);
    const [minLat, minLon] = this.metersToLatLon(minX, minY);
    const [maxLat, maxLon] = this.metersToLatLon(maxX, maxY);

    return {
      minLat, minLon, maxLat, maxLon,
    };
  }

  getTileBounds(x, y, zoom) {
    const [minX, minY] = this.pixelsToMeters(x * this.tileSize, (y + 1) * this.tileSize, zoom);
    const [maxX, maxY] = this.pixelsToMeters((x + 1) * this.tileSize, y * this.tileSize, zoom);
    return {
      minX, minY, maxX, maxY,
    };
  }

  pixelsToMeters(x, y, zoom) {
    const res = this.getResolution(zoom);
    const mx = x * res - this.originShift;
    const my = y * res - this.originShift;
    return [mx, my];
  }

  getResolution(zoom) {
    return this.initialResolution / 2 ** zoom;
  }

  metersToLatLon(mx, my) {
    const lon = (mx / this.originShift) * 180.0;
    let lat = (my / this.originShift) * 180.0;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);

    return [lat, lon];
  }
}
