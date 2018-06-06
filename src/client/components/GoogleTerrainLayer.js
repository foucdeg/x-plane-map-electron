/* globals L */
/* eslint class-methods-use-this: "off" */

import { TileLayer } from 'react-leaflet';

export default class GoogleTerrainLayer extends TileLayer {
  createLeafletElement() {
    return L.gridLayer.googleMutant({
      type: 'terrain', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }
}

delete GoogleTerrainLayer.propTypes.url;
