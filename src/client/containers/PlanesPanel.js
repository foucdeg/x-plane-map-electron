import { setActivePlane, renamePlane, removePlane, toggleTrace, clearTrace, changeIcon, fetchPlanes } from '../actions';
import { connect } from 'react-redux';
import Panel from '../components/Panel';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    onPlaneSelect: (plane) => dispatch(setActivePlane(plane)),
    onPlaneRename: (plane, newName) => dispatch(renamePlane(plane, newName)),
    onPlaneTraceToggle: (plane) => dispatch(toggleTrace(plane)),
    onPlaneTraceClear: (plane) => dispatch(clearTrace(plane)),
    onPlaneIconChange: (plane) => dispatch(changeIcon(plane)),
    fetchPlanes: () => dispatch(fetchPlanes())
  };
};

const PlanesPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);

export default PlanesPanel;
