import { Path, withLeaflet } from 'react-leaflet';
import LeafletHotline from 'leaflet-hotline';

class Trace extends Path {
  createLeafletElement(props) {
    return new LeafletHotline.Hotline(props.positions, this.getOptions(props));
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setLatLngs(toProps.positions);
    }
  }
}

export default withLeaflet(Trace);
