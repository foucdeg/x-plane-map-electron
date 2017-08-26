import { TileLayer } from 'react-leaflet';

export default class GoogleSatelliteLayer extends TileLayer {
  constructor() {
    super();
    GoogleSatelliteLayer.propTypes = {};
  }

  createLeafletElement(props) {
    return L.gridLayer.googleMutant({
      type: 'hybrid'
    });
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }
}
