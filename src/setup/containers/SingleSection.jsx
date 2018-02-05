import { connect } from 'react-redux';
import SingleSectionCmp from '../components/SingleSection';

const mapStateToProps = state => state;

const SingleSection = connect(mapStateToProps)(SingleSectionCmp);

export default SingleSection;
