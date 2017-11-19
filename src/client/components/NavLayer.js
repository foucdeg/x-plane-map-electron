/* eslint class-methods-use-this: "off", no-mixed-operators: "off" */

import Leaflet from 'leaflet';
import { TileLayer } from 'react-leaflet';
import { decodeConfig } from '../helpers';

const config = decodeConfig();
// const EARTH_PERIMETER = 2 * Math.PI * 6378137;

Leaflet.TileLayer.NavLayer = Leaflet.TileLayer.extend({
  getTileUrl: function getTileUrl(coords) {
    const north = 170 / Math.PI * Math.asin(1 - coords.y / 2 ** (coords.z - 1));
    const south = 170 / Math.PI * Math.asin(1 - (coords.y + 1) / 2 ** (coords.z - 1));
    const west = 180 * (2 * coords.x / 2 ** (coords.z) - 1);
    const east = 180 * (2 * (coords.x + 1) / 2 ** (coords.z) - 1);

    return [
      config.mapTilesUrl,
      '?north=', north.toFixed(4),
      '&south=', south.toFixed(4),
      '&east=', east.toFixed(4),
      '&west=', west.toFixed(4),
    ].join('');
  },
});

export default class NavLayer extends TileLayer {
  createLeafletElement() {
    return new Leaflet.TileLayer.NavLayer({
      tileSize: 512,
    });
  }
}

delete NavLayer.propTypes.url;
