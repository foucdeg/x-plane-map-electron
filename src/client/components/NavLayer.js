import Leaflet from 'leaflet';
import { TileLayer } from 'react-leaflet';
import { decodeConfig } from '../helpers';

const config = decodeConfig();
const EARTH_PERIMETER = 2 * Math.PI * 6378137;

Leaflet.TileLayer.NavLayer = Leaflet.TileLayer.extend({
  getTileUrl: function(coords) {
    let north = 170 / Math.PI * Math.asin(1 - coords.y / Math.pow(2, coords.z - 1));
    let south = 170 / Math.PI * Math.asin(1 - (coords.y + 1) / Math.pow(2, coords.z - 1));
    let west = 180 * (2 * coords.x / Math.pow(2, coords.z) - 1);
    let east = 180 * (2 * (coords.x + 1) / Math.pow(2, coords.z) - 1);

    return [
      config.mapTilesUrl,
      '?north=', north.toFixed(4),
      '&south=', south.toFixed(4),
      '&east=',  east.toFixed(4),
      '&west=',  west.toFixed(4)
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
