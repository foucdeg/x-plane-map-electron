import { Polyline } from 'react-leaflet';
import LeafletHotline from 'leaflet-hotline';

export default class Trace extends Polyline {
  createLeafletElement(props) {
    return new LeafletHotline.Hotline(props.positions, this.getOptions(props));
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setLatLngs(toProps.positions);
    }
  }
}
