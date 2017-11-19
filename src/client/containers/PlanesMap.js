import { connect } from 'react-redux';
import { setActivePlane } from '../actions';
import Map from '../components/Map';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onPlaneLeave: () => dispatch(setActivePlane(false)),
});

const PlanesMap = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(Map);

export default PlanesMap;
