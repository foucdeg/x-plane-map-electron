import { connect } from 'react-redux';
import MultiClientSectionCmp from '../components/MultiClientSection';
import { setConfig } from '../actions';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  onSave: config => dispatch(setConfig(config)),
});

const MultiClientSection = connect(mapStateToProps, mapDispatchToProps)(MultiClientSectionCmp);

export default MultiClientSection;
