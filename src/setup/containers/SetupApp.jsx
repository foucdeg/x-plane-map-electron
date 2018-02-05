import { connect } from 'react-redux';
import App from '../components/App';
import { start, loadConfig } from '../actions';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  onStart: config => dispatch(start(config)),
  loadConfig: () => dispatch(loadConfig()),
});

const SetupApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default SetupApp;
