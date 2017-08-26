import { TileLayer } from 'react-leaflet';

export default class GoogleMapLayer extends TileLayer {
  constructor() {
    super();
    GoogleMapLayer.propTypes = {};
  }

  createLeafletElement(props) {
    return L.gridLayer.googleMutant({
      type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }
}
