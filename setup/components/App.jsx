/* eslint import/no-extraneous-dependencies: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import NavMenuItem from './NavMenuItem';
import NavMenuSwitch from './NavMenuSwitch';
import SingleSection from '../containers/SingleSection';
import MultiServerSection from '../containers/MultiServerSection';
import MultiClientSection from '../containers/MultiClientSection';
import ConfigSection from '../containers/ConfigSection';

import { X_PLANE_11, X_PLANE_10 } from '../actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'single',
    };

    this.handleStart = this.handleStart.bind(this);
  }

  componentWillMount() {
    this.props.loadConfig();
  }

  handleNavigation(pageTo) {
    this.setState({ page: pageTo });
  }

  handleStart() {
    const mode = this.state.page === 'multi-client' ? 'remote' : 'local';
    if (!this.props.isConfigValid && mode === 'local') return;
    this.props.onStart({
      ...this.props,
      mode,
    });
  }

  canStart() {
    return this.state.page === 'multi-client' || this.props.isConfigValid;
  }

  renderCurrentPage() {
    if (this.props.loading) return null;
    switch (this.state.page) {
      case 'single':
        return <SingleSection />;
      case 'multi-server':
        return <MultiServerSection />;
      case 'multi-client':
        return <MultiClientSection />;
      case 'config':
        return <ConfigSection />;
      default: return null;
    }
  }

  render() {
    return (
      <div className="config-wrapper">
        <header>
          <img className="logo" src="images/logo.png" alt="XMap logo" />
          <h1>Airspaces <small>v2.6.0</small></h1>
        </header>
        <main>
          <nav>
            {/* eslint-disable react/jsx-no-bind */}
            <NavMenuItem
              title="Single Pilot"
              subtext="It&apos;s just you"
              onClick={this.handleNavigation.bind(this, 'single')}
              active={this.state.page === 'single'}
            />
            <NavMenuItem
              title="Multi-Pilot"
              subtext="You are the map server"
              onClick={this.handleNavigation.bind(this, 'multi-server')}
              active={this.state.page === 'multi-server'}
            />
            <NavMenuItem
              title="Multi-Pilot"
              subtext="Someone else is the map server"
              onClick={this.handleNavigation.bind(this, 'multi-client')}
              active={this.state.page === 'multi-client'}
            />
            <NavMenuItem
              title="Advanced Setup"
              subtext="Ports and stuff"
              onClick={this.handleNavigation.bind(this, 'config')}
              active={this.state.page === 'config'}
              hasWarning={!this.props.isConfigValid}
            />
            <NavMenuSwitch
              title="X-Plane Version"
              values={[X_PLANE_11, X_PLANE_10]}
              value={this.props.xPlaneVersion}
              onChange={this.props.onXPlaneVersionChange}
            />
            {/* eslint-enable react/jsx-no-bind */}
            { this.canStart() && (
              <a className="submit-button" onClick={this.handleStart}>
                <h3>All Set, Let&apos;s Go!</h3>
              </a>
            )}
          </nav>
          { this.renderCurrentPage() }
        </main>
      </div>
    );
  }
}

App.propTypes = {
  xPlaneVersion: PropTypes.number.isRequired,
  isConfigValid: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  loadConfig: PropTypes.func.isRequired,
  onXPlaneVersionChange: PropTypes.func.isRequired,
};

App.defaultProps = {
  isConfigValid: false,
};

export default App;
