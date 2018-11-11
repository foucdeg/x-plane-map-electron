/* eslint import/no-extraneous-dependencies: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';

class ExternalLink extends React.Component {
  constructor(props) {
    super(props);

    this.openLink = this.openLink.bind(this);
  }

  openLink(e) {
    e.preventDefault();
    shell.openExternal(this.props.href);
  }

  render() {
    return <a onClick={this.openLink} href={this.props.href}>{this.props.children}</a>;
  }
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ExternalLink.defaultProps = {
  children: null,
};

export default ExternalLink;
