import { connect } from 'react-redux';
import MultiServerSectionCmp from '../components/MultiServerSection';

const mapStateToProps = state => state;

const MultiServerSection = connect(mapStateToProps)(MultiServerSectionCmp);

export default MultiServerSection;
