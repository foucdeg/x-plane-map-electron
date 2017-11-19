import { setActivePlane } from '../actions';
import { connect } from 'react-redux';
import Map from '../components/Map';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    onPlaneLeave: () => dispatch(setActivePlane(false))
  };
};

const PlanesMap = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Map);

export default PlanesMap;
