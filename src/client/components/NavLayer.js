import Leaflet from 'leaflet';
import { TileLayer } from 'react-leaflet';
import { decodeConfig } from '../helpers';

const config = decodeConfig();
const EARTH_PERIMETER = 2 * Math.PI * 6378137;

Leaflet.TileLayer.NavLayer = Leaflet.TileLayer.extend({
  getTileUrl: function(coords) {
    let minXMeters = EARTH_PERIMETER * (coords.x / Math.pow(2, coords.z) - 0.5);
    let maxXMeters = EARTH_PERIMETER * ((coords.x + 1) / Math.pow(2, coords.z) - 0.5);

    let maxYMeters = EARTH_PERIMETER / 2 * (0.5 - coords.y / Math.pow(2, coords.z));
    let minYMeters = EARTH_PERIMETER / 2 * (0.5 - (coords.y + 1) / Math.pow(2, coords.z));

    let northEast = Leaflet.Projection.SphericalMercator.unproject(Leaflet.point(maxXMeters, maxYMeters));
    let southWest = Leaflet.Projection.SphericalMercator.unproject(Leaflet.point(minXMeters, minYMeters));
    return [
      config.mapTilesUrl,
      '?north=', northEast.lat.toFixed(4),
      '&south=', southWest.lat.toFixed(4),
      '&east=',  northEast.lng.toFixed(4),
      '&west=',  southWest.lng.toFixed(4)
    ].join('');
  }
});

export default class NavLayer extends TileLayer {
  createLeafletElement(props) {
    return new Leaflet.TileLayer.NavLayer({
      tileSize: 512
    });
  }
}

delete NavLayer.propTypes.url;
