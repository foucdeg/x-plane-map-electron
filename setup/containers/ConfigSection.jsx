import { connect } from 'react-redux';
import ConfigSectionCmp from '../components/ConfigSection';
import { setConfig } from '../actions';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  onSave: config => dispatch(setConfig(config)),
});

const ConfigSection = connect(mapStateToProps, mapDispatchToProps)(ConfigSectionCmp);

export default ConfigSection;
